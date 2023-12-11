import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { colors } from '../styles/Colors';
import { firestore } from "../assets/firebase";
import { Entypo } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { useDrug, useLoading } from "../hooks";

export default function Home({ navigation }) {
    const {setIsLoading} = useLoading();
	const [drugName, setDrugName] = useState("");
	const [gestationalAge, setGestationalAge] = useState("");
	const [postnatalAge, setPostnatalAge] = useState("");
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [output, setOutput] = useState({list: [], isGen: false});
    const {drugsNamesList} = useDrug();

	const [patient, setPatient] = useState("");
	const [MRD, setMRD] = useState("");
	const [gender, setGender] = useState("");
	const [serum, setSerum] = useState("");
	const [condition, setCondition] = useState("");
	const [weightUnit, setWeightUnit] = useState("g");
	const [heightUnit, setHeightUnit] = useState("cm");
	const [conditionList, setConditionList] = useState([]);
    const conditionsDB = firestore.collection("conditions");

    const genderList = ["Male","Female","Other"];
    const heightUnitList = ["m", "cm"];
    const weightUnitList = ["kg", "g"];
	const [creatineClearance, setCreatineClearance] = useState("");

	useEffect(() => {
        const focusHandler = navigation.addListener("focus",() => {
			setOutput({list: [], isGen: false});
			setCreatineClearance("");
		});
        return focusHandler;
	}, [navigation]);

	const drugsDB = firestore.collection("drugs");

	const resetInputFields = () => {
		setDrugName("");
		setGestationalAge("");
		setPostnatalAge("");
		setWeight("");
		setHeight("");
	}

	useEffect(() => {
		if (drugName !== "") {
			setIsLoading(true);
			const conditions = [];
			const unsubscribe = conditionsDB
			.orderBy("condition")
			.onSnapshot((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					var condition = doc.data();
					if (!conditions.includes(condition["condition"]) && condition["name"] == drugName) {
						conditions.push(condition["condition"]);
					}
				});
				setConditionList(conditions);
				setIsLoading(false);
			});
			return unsubscribe;
		}
	}, [drugName]);

	const generatePrescription = () => {
		setIsLoading(true);
		var CRCL;
		const gestPostFilter = (currDrug) => {
			if (gestationalAge === "" && postnatalAge === "") {
				drugs.push(currDrug);
			}
			if (gestationalAge !== "" && (currDrug["lower_gestational_age"] <= gestationalAge && currDrug["upper_gestational_age"] >= gestationalAge)) {
				if (postnatalAge !== "" && (currDrug["lower_postnatal_age"] <= postnatalAge && currDrug["upper_postnatal_age"] >= postnatalAge)) {
					drugs.push(currDrug);
				}
				else if (postnatalAge === "") {
					drugs.push(currDrug);
				}
			}
			else if (gestationalAge === "") {
				if (postnatalAge !== "" && (currDrug["lower_postnatal_age"] <= postnatalAge && currDrug["upper_postnatal_age"] >= postnatalAge)) {
					drugs.push(currDrug);
				}
				else if (postnatalAge === "") {
					drugs.push(currDrug);
				}
			}
			if (postnatalAge !== "" && (currDrug["lower_postnatal_age"] <= postnatalAge && currDrug["upper_postnatal_age"] >= postnatalAge)) {
				if (gestationalAge !== "" && (currDrug["lower_gestational_age"] <= gestationalAge && currDrug["upper_gestational_age"] >= gestationalAge)) {
					drugs.push(currDrug);
				}
				else if (gestationalAge === "") {
					drugs.push(currDrug);
				}
			}
			else if (postnatalAge === "") {
				if (gestationalAge !== "" && (currDrug["lower_gestational_age"] <= gestationalAge && currDrug["upper_gestational_age"] >= gestationalAge)) {
					drugs.push(currDrug);
				}
				else if (gestationalAge === "") {
					drugs.push(currDrug);
				}
			}
		}

		if (patient === "" || MRD === "" || gender === "" || drugName === "" || weight === "" || height === "" || condition === "" || serum === "") {
			alert("Please fill the required values");
			setIsLoading(false);
			return;
		}
		const k = (gestationalAge <= 37 ? 0.33 : (gestationalAge <= 42 && gestationalAge > 37) ? 0.45 : 0.55);

		if (heightUnit === "m") {
			setCreatineClearance(()=>((k*height*100)/serum).toFixed(2));
			CRCL = ((k*height*100)/serum).toFixed(2);
		}
		else {
			setCreatineClearance(()=>((k*height)/serum).toFixed(2));
			CRCL = ((k*height)/serum).toFixed(2);
		}

		const drugs = [];
		drugsDB
		.where("name_of_the_drug", "==", drugName)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var currDrug = doc.data();
				currDrug.id = doc.id;
				if (condition===currDrug["condition"]){
					if (currDrug["min_crcl"] !== "" && currDrug["max_crcl"] !== "") {
						if(parseFloat(CRCL) <= currDrug["max_crcl"] && parseFloat(CRCL) > currDrug["min_crcl"]) {
							if(currDrug["dose_type"]==='Renal'){
								gestPostFilter(currDrug);
							}
						}
						else {
							if(currDrug["dose_type"]==='Usual'){
								gestPostFilter(currDrug);
							}
						}
					}
					else if (currDrug["min_crcl"] === "" && currDrug["max_crcl"] === "") {
						if(currDrug["dose_type"]==='Renal') {
							gestPostFilter(currDrug);
						}
						if(currDrug["dose_type"]==='Usual'){
							gestPostFilter(currDrug);
						}
					}
					
				}
			});
			var hasRenal = false;
			var uniqueDrugs = [...new Set(drugs.map((item) => JSON.stringify(item)))].map((item) => {
				const parsedItem = JSON.parse(item);
				if(parsedItem["dose_type"] === "Usual" && hasRenal === true) {
					hasRenal = true;
				}
				else if (parsedItem["dose_type"] === "Usual" && hasRenal === false) {
					hasRenal = false;
				}
				else if (parsedItem["dose_type"] === "Renal") {
					hasRenal = true;
				}
				return parsedItem;
			});
			if (hasRenal === true) {
				uniqueDrugs = uniqueDrugs.filter((item) => item["dose_type"] === "Renal");
			}
			else {
				uniqueDrugs = uniqueDrugs.filter((item) => item["dose_type"] === "Usual");
			}
			setOutput({list: uniqueDrugs, isGen: true});
		})
		.catch((error) => {
			alert(error);
			setIsLoading(false);
		});
	}

	useEffect(() => {
		setCondition('')
	}, [drugName]);

	useEffect(() => {
		setIsLoading(false);
		if (output.list.length !== 0 && output.isGen === true) {
			navigation.navigate("Output", {
                drugs: output.list,
                weight: weight,
                height: height,
                patient: patient,
                MRD: MRD,
                gender: gender,
                creatineClearance: creatineClearance,
                weightUnit,
                heightUnit,
                gestationalAge,
				postnatalAge,
            });
		}
		else if (output.list.length === 0 && output.isGen === true) {
			alert("No valid prescription for entered inputs!");
		}
	}, [output]);

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={[styles.inputContainer, {marginTop: 50}]}>
				<TextInput style={styles.input} value={patient} onChangeText={(newPatient) => setPatient(newPatient)} />
				<Text style={styles.label}>Patient Name</Text>
			</View>
			<View style={styles.inputContainer}>
				<TextInput keyboardType='numeric' style={styles.input} value={MRD} onChangeText={(newMRD) => setMRD(newMRD)} />
				<Text style={styles.label}>MRD</Text>
			</View>
			<View style={styles.dropdownContainer}>
				<SelectDropdown
					data={genderList}
					dropdownStyle={styles.dropdown}
					searchPlaceHolder="Search"
					search="true"
					searchInputStyle={styles.dropdownSearch}
					buttonStyle={styles.dropdownInput}
					buttonTextStyle={styles.dropdownText}
					rowTextStyle={styles.dropdownText}
					defaultButtonText="Select gender"
					renderDropdownIcon={() => {return <Entypo style={styles.dropdownIcon} name="chevron-thin-down" />} }
					renderSearchInputRightIcon={() => {return <Fontisto style={styles.dropdownIcon} name="search" />} }
					onSelect={(selectedItem, index) => {
						setGender(selectedItem)
					}}
					buttonTextAfterSelection={(selectedItem, index) => {
						return selectedItem
					}}
					rowTextForSelection={(item, index) => {
						return item
					}}
				/>
				<Text style={styles.label}>Gender</Text>
			</View>
			<View style={styles.dropdownContainer}>
				<SelectDropdown
					data={drugsNamesList}
					dropdownStyle={styles.dropdown}
					searchPlaceHolder="Search"
					search="true"
					searchInputStyle={styles.dropdownSearch}
					buttonStyle={styles.dropdownInput}
					buttonTextStyle={styles.dropdownText}
					rowTextStyle={styles.dropdownText}
					defaultButtonText="Select drug"
					renderDropdownIcon={() => {return <Entypo style={styles.dropdownIcon} name="chevron-thin-down" />} }
					renderSearchInputRightIcon={() => {return <Fontisto style={styles.dropdownIcon} name="search" />} }
					onSelect={(selectedItem, index) => {
						setDrugName(selectedItem);
						setCondition('');
					}}
					buttonTextAfterSelection={(selectedItem, index) => {
						return drugName;
					}}
					rowTextForSelection={(item, index) => {
						return item
					}}
				/>
				<Text style={styles.label}>Drug Name</Text>
			</View>
			<View style={styles.inputContainer}>
				<TextInput keyboardType='numeric' style={styles.input} value={gestationalAge} onChangeText={(newGestationalAge) => setGestationalAge(newGestationalAge)} />
				<Text style={styles.label}>Gestational Age</Text>
				<Text style={styles.suffixText}>weeks</Text>
			</View>
			<View style={styles.inputContainer}>
				<TextInput keyboardType='numeric' style={styles.input} value={postnatalAge} onChangeText={(newPostnatalAge) => setPostnatalAge(newPostnatalAge)} />
				<Text style={styles.label}>Postnatal Age</Text>
				<Text style={styles.suffixText}>days</Text>
			</View>
			<View style={styles.inputContainer}>
				<TextInput keyboardType='numeric' style={[styles.input, {width: "65%", marginRight: 13}]} value={weight} onChangeText={(newWeight) => setWeight(newWeight)} />
				<SelectDropdown
					data={weightUnitList}
					dropdownStyle={styles.dropdownUnit}
					searchPlaceHolder="Search"
					search="true"
					searchInputStyle={styles.dropdownSearchUnit}
					buttonStyle={styles.dropdownInputUnit}
					buttonTextStyle={styles.dropdownTextUnit}
					rowTextStyle={styles.dropdownTextUnit}
					defaultButtonText=" "
					defaultValue="g"
					renderDropdownIcon={() => {return <Entypo style={styles.dropdownIconUnit} name="chevron-thin-down" />} }
					renderSearchInputRightIcon={() => {return <Fontisto style={styles.dropdownIconUnit} name="search" />} }
					onSelect={(selectedItem, index) => {
						setWeightUnit(selectedItem)
					}}
					buttonTextAfterSelection={(selectedItem, index) => {
						return weightUnit;
					}}
					rowTextForSelection={(item, index) => {
						return item
					}}
				/>
				<Text style={styles.label}>Weight</Text>
			</View>
			<View style={styles.inputContainer}>
				<TextInput keyboardType='numeric' style={[styles.input, {width: "65%", marginRight: 13}]} value={height} onChangeText={(newHeight) => setHeight(newHeight)} />
				<SelectDropdown
					data={heightUnitList}
					dropdownStyle={styles.dropdownUnit}
					searchPlaceHolder="Search"
					search="true"
					searchInputStyle={styles.dropdownSearchUnit}
					buttonStyle={styles.dropdownInputUnit}
					buttonTextStyle={styles.dropdownTextUnit}
					rowTextStyle={styles.dropdownTextUnit}
					defaultButtonText=" "
					defaultValue="cm"
					renderDropdownIcon={() => {return <Entypo style={styles.dropdownIconUnit} name="chevron-thin-down" />} }
					renderSearchInputRightIcon={() => {return <Fontisto style={styles.dropdownIconUnit} name="search" />} }
					onSelect={(selectedItem, index) => {
						setHeightUnit(selectedItem)
					}}
					buttonTextAfterSelection={(selectedItem, index) => {
						return heightUnit;
					}}
					rowTextForSelection={(item, index) => {
						return item
					}}
				/>
				<Text style={styles.label}>Length</Text>
			</View>
			{drugName !== "" &&
				<View style={styles.dropdownContainer}>
					<SelectDropdown
						data={conditionList}
						dropdownStyle={styles.dropdown}
						searchPlaceHolder="Search"
						search="true"
						searchInputStyle={styles.dropdownSearch}
						buttonStyle={styles.dropdownInput}
						buttonTextStyle={styles.dropdownText}
						rowTextStyle={styles.dropdownText}
						defaultButtonText="Select condition"
						renderDropdownIcon={() => {return <Entypo style={styles.dropdownIcon} name="chevron-thin-down" />} }
						renderSearchInputRightIcon={() => {return <Fontisto style={styles.dropdownIcon} name="search" />} }
						onSelect={(selectedItem, index) => {
							setCondition(selectedItem)
						}}
						buttonTextAfterSelection={(selectedItem, index) => {
							return condition;
						}}
						rowTextForSelection={(item, index) => {
							return item
						}}
					/>
					<Text style={styles.label}>Condition</Text>
				</View>
			}
			<View style={styles.inputContainer}>
				<TextInput keyboardType='numeric' style={styles.input} value={serum} onChangeText={(newSerum) => setSerum(newSerum)} />
				<Text style={styles.label}>Serum Creatinine</Text>
				<Text style={styles.suffixText}>mg/dl</Text>
			</View>
			<View style={[styles.submitContainer, {marginBottom: 50}]}>
				<TouchableOpacity style={styles.submitButton} onPress={generatePrescription}>
					<Text style={styles.submitText}>Generate Prescription</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: "100%",
		backgroundColor: colors.lightColor2,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: "100%",
		backgroundColor: colors.lightColor2,
	},
	inputContainer: {
		width: "80%",
		marginBottom: 30,
		flexDirection: "row",
	},
	input: {
		backgroundColor: colors.white,
		borderRadius: 10,
		height: 50,
		paddingHorizontal: 15,
		fontSize: 17,
		borderColor: colors.primaryColor,
		borderWidth: 1,
		width: "100%",
        fontFamily: "MontserratBold",
	},
	label: {
		position: "absolute",
		fontSize: 14,
		top: -12,
		left: 10,
		backgroundColor: colors.primaryColor,
		paddingHorizontal: 9,
		paddingVertical: 3,
		borderRadius: 10,
		color: colors.white,
        fontFamily: "MontserratBold",
	},
	dropdownContainer: {
		marginBottom: 30,
        fontFamily: "MontserratBold",
	},
	dropdown: {
		// marginTop: "-7.5%",
		backgroundColor: colors.white,
		borderRadius: 10,
		fontSize: 17,
		borderColor: colors.primaryColor,
		borderWidth: 1,
		width: "80%",
		alignItems: "center",
        fontFamily: "MontserratBold",
	},
	dropdownInput: {
		backgroundColor: colors.white,
		borderRadius: 10,
		height: 50,
		fontSize: 17,
		borderColor: colors.primaryColor,
		borderWidth: 1,
		width: "80%",
        fontFamily: "MontserratBold",
	},
	dropdownSearch: {
		width: "100%",
		borderBottomColor: colors.primaryColor,
		borderBottomWidth: 1,
        fontFamily: "MontserratBold",
	},
	dropdownText: {
        fontFamily: "MontserratBold",
		fontSize: 17,
	},
	dropdownIcon: {
        fontFamily: "MontserratBold",
		fontSize: 17,
		paddingRight: 7,
	},
	submitContainer: {
		width: "80%",
	},
	submitButton: {
		width: "100%",
		backgroundColor: colors.primaryColor,
		paddingVertical: 13,
		borderRadius: 10,
		marginTop: 5,
	},
	submitText: {
		textAlign: "center",
		justifyContent: "center",
		fontSize: 18,
		color: colors.white,
        fontFamily: "MontserratBold",
	},
	suffixText: {
		fontSize: 15,
		fontWeight: "400",
		marginRight: 15,
		justifyContent: "center",
		alignItems: "center",
		textAlignVertical: "center",
		height: "100%",
		position: "absolute",
		right: 0,
        fontFamily: "MontserratBold",
	},
	dropdownContainerUnit: {
		marginBottom: 30,
        fontFamily: "MontserratBold",
	},
	dropdownUnit: {
		// marginTop: "-7.5%",
		backgroundColor: colors.white,
		borderRadius: 10,
		fontSize: 17,
		borderColor: colors.primaryColor,
		borderWidth: 1,
		width: "25%",
		alignItems: "center",
        fontFamily: "MontserratBold",
	},
	dropdownInputUnit: {
		backgroundColor: colors.white,
		borderRadius: 10,
		height: 50,
		fontSize: 17,
		borderColor: colors.primaryColor,
		borderWidth: 1,
		width: "30%",
        fontFamily: "MontserratBold",
	},
	dropdownSearchUnit: {
		width: "100%",
		borderBottomColor: colors.primaryColor,
		borderBottomWidth: 1,
        fontFamily: "MontserratBold",
	},
	dropdownTextUnit: {
        fontFamily: "MontserratBold",
		fontSize: 17,
	},
	dropdownIconUnit: {
        fontFamily: "MontserratBold",
		fontSize: 17,
		paddingRight: 7,
	},
});