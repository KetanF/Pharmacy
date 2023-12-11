import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';
import {colors} from '../styles/Colors';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';
import { moveAsync } from 'expo-file-system';
import { GestationalAgeHTML, PostnatalAgeHTML, ConditionHTML, StorageConditionHTML, InfusionRateHTML, SolutionCompHTML, ROAHTML, DoseHTML, StandardDoseHTML, CRCLHTML, ConcentrationHTML, StandardConcentrationHTML, RenalTextHTML } from "./HTMLtemplateComp";

export default Output = ({route, navigation}) => {
    const {drugs, weight, height, patient, MRD, gender, creatineClearance, weightUnit, heightUnit, gestationalAge, postnatalAge} = route.params;
    const [outputWeight, setOutputWeight] = useState(weightUnit === "g" ? (weight/1000).toFixed(2) : weight);

    const BSAcalc = () => {
        if (weightUnit === "g" && heightUnit === "cm") {
            return Math.sqrt(((weight*height)/3600000)).toFixed(2)
        }
        else if (weightUnit === "g" && heightUnit === "m") {
            return Math.sqrt(((weight*height)/36000)).toFixed(2)
        }
        else if (weightUnit === "kg" && heightUnit === "cm") {
            return Math.sqrt(((weight*height)/3600)).toFixed(2)
        }
        else if (weightUnit === "kg" && heightUnit === "m") {
            return Math.sqrt(((weight*height)/36)).toFixed(2)
        }
    }

    const html = `
        <!DOCTYPE html>
            <html>
                <head>
                    <title>Prescription</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            margin: 0;
                            padding: 0;
                            background-color: #f7f7f7;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                        }

                        h3 {
                            color: #0aaa86;
                            text-align: center;
                            padding: 6px;
                            border-bottom: 2px solid #0aaa86;
                        }

                        h4 {
                            color: #0aaa86;
                            margin: -5px 0 5px;
                            text-align: center;
                        }

                        table {
                            border-collapse: separate;
                            border-spacing: 0;
                            margin: 10px auto 20px;
                            background-color: #fff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            border-radius: 10px;
                            overflow: hidden;
                        }

                        th,
                        td {
                            padding: 0.5rem;
                            text-align: left;
                            border-bottom: 1px solid #ccc;
                            min-width: 8rem;
                            max-width: 8rem;
                            font-size: 13px;
                            word-wrap: break-word;
                        }

                        th {
                            background-color: #0aaa86;
                            color: #fff;
                            border-bottom: none;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            font-weight: normal;
                            font-size: 11px;
                        }

                        tr:nth-child(odd) th {
                            background-color: #4fc2a8;
                        }

                        tr:nth-child(even) th {
                            background-color: #0aaa86;
                        }

                        tr:nth-child(even) {
                            background-color: #f2f2f2;
                        }

                        td[colspan="2"] {
                            font-weight: bold;
                            border-top: 1px solid #ccc;
                            border-bottom: none;
                        }

                        sup {
                            font-size: 80%;
                            vertical-align: super;
                        }

                        .container {
                            background-color: #fff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            padding: 1rem;
                            border-radius: 10px;
                            min-width: 30rem;
                            max-width: 30rem;
                            margin: 10px auto 20px;
                        }

                        .label {
                            color: #0aaa86;
                            font-weight: bold;
                            padding-bottom: 0.2rem;
                            font-size: 14px;
                        }

                        .value {
                            font-size: 13px;
                        }

                        .row:not(:last-of-type) {
                            margin-bottom: 0.5rem;
                        }

                        .renalRow {
                            width: 100%;
                        }

                        .renalValue {
                            font-size: 17;
                            color: #dc3545;
                            font-weight: bold;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                    </style>
                </head>

                <body>
                    <h3>Prescription</h3>
                    <h4>Demographic Details</h4>
                    <table>
                        <tr>
                            <th>MRD</th>
                            <td>${MRD}</td>
                            <th>Date</th>
                            <td>${formatDate(new Date(), false)}</td>
                        </tr>
                        <tr>
                            <th>Patient Name</th>
                            <td>${patient}</td>
                            <th>Gender</th>
                            <td>${gender}</td>
                        </tr>
                        <tr>
                            <th>Gestational age</th>
                            <td>${gestationalAge ? `${gestationalAge} weeks` : "-"}</td>
                            <th>Postnatal age</th>
                            <td>${postnatalAge ? `${postnatalAge} days` : "-"}</td>
                        </tr>
                        <tr>
                            <th>Weight</th>
                            <td>${weight} ${weightUnit}</td>
                            <th>Length</th>
                            <td>${height} ${heightUnit}</td>
                        </tr>
                        <tr>
                            <th>BSA</th>
                            <td>${BSAcalc()} m<sup>2</sup></td>
                            <th>Creatinine Clearance</th>
                            <td>${creatineClearance} ml/min/1.73m<sup>2</sup></td>
                        </tr>
                    </table>
                    <h4>Medication Details - ${drugs[0]["name_of_the_drug"]}</h4>
                    ${RenalTextHTML(drugs[0]["dose_type"] === "Renal")}
                    ${drugs.map((drug) => {
                        return `
                            <div class="container">
                                ${GestationalAgeHTML({
                                    lower: drug["lower_gestational_age"],
                                    upper: drug["upper_gestational_age"],
                                })}
                                ${PostnatalAgeHTML({
                                    lower: drug["lower_postnatal_age"],
                                    upper: drug["upper_postnatal_age"],
                                })}
                                ${ConditionHTML({
                                    condition: drug["condition"],
                                })}
                                ${DoseHTML({
                                    lower: drug["min_dose"],
                                    upper: drug["max_dose"],
                                    unit: drug["dose_unit"],
                                    dose: drug["dose_days"],
                                    freq: drug["frequency"],
                                    outputWeight: outputWeight,
                                })}
                                ${StandardDoseHTML({
                                    lower: drug["min_dose"],
                                    upper: drug["max_dose"],
                                    unit: drug["dose_unit"],
                                    dose: drug["dose_days"],
                                })}
                                ${ROAHTML({
                                    roa: drug["roa"],
                                })}
                                ${CRCLHTML({
                                    lower: drug["min_crcl"],
                                    upper: drug["max_crcl"],
                                })}
                                ${ConcentrationHTML({
                                    lower: drug["min_concentration"],
                                    upper: drug["max_concentration"],
                                    unit: drug["concentration_unit"],
                                    lowerDose: drug["min_dose"],
                                    upperDose: drug["max_dose"],
                                    doseUnit: drug["dose_unit"],
                                    outputWeight: outputWeight,
                                })}
                                ${StandardConcentrationHTML({
                                    lower: drug["min_concentration"],
                                    upper: drug["max_concentration"],
                                    unit: drug["concentration_unit"],
                                    lowerDose: drug["min_dose"],
                                    upperDose: drug["max_dose"],
                                    outputWeight: outputWeight,
                                })}
                                ${InfusionRateHTML({
                                    infusion: drug["infusion_rate"],
                                })}
                                ${SolutionCompHTML({
                                    sol: drug["solution_compatibility"],
                                })}
                                ${StorageConditionHTML({
                                    storage: drug["storage"],
                                })}
                            </div>
                        `;
                    })}
                </body>
            </html>
    `;

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    
    function formatDate(date, timezoneT) {
        if (timezoneT) {
            return (
                [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
                ].join('-') +
                'T' +
                [
                padTo2Digits(date.getHours()),
                padTo2Digits(date.getMinutes()),
                padTo2Digits(date.getSeconds()),
                ].join(':')
            );
        }
        return (
            [
            padTo2Digits(date.getDate()),
            padTo2Digits(date.getMonth() + 1),
            date.getFullYear(),
            ].join('-') +
            ' ' +
            [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

    let generatePdf = async () => {
        const file = await printToFileAsync({
        html: html,
        base64: false
        });

        const pdfName = `${file.uri.slice(0,file.uri.lastIndexOf('/') + 1)}${patient}_${MRD}_${formatDate(new Date(), true)}.pdf`;

        await moveAsync({
            from: file.uri,
            to: pdfName,
        })

        await shareAsync(pdfName);
    };

    const GestationalAge = ({lower, upper}) => {
        if (lower || upper) {
            if (lower === 0 && upper === 100) {
                return null;
            }
            else if (upper === 100 && lower !== 0) {
                return (<>
                    <Text style={styles.subtitleLabel}>Gestational Age:</Text>
                    <Text style={styles.subtitle}>Greater than {lower} weeks</Text>
                </>
                );
            }
            else if (lower === 0 && upper !== 100) {
                return (<>
                    <Text style={styles.subtitleLabel}>Gestational Age:</Text>
                    <Text style={styles.subtitle}>Less than {upper} weeks</Text>
                </>
                );
            }
            if (lower !== 0 && upper !== 100) {
                return (<>
                    <Text style={styles.subtitleLabel}>Gestational Age:</Text>
                    <Text style={styles.subtitle}>{lower} to {upper} weeks</Text>
                </>
                );   
            }
        }
        else if (!lower && !upper) {
            return null;   
        }
    }

    const PostnatalAge = ({lower, upper}) => {
        if (lower || upper) {
            if (lower === 0 && upper === 500) {
                return null;
            }
            else if (upper === 500 && lower !== 0) {
                return (<>
                    <Text style={styles.subtitleLabel}>Postnatal Age:</Text>
                    <Text style={styles.subtitle}>Greater than {lower} days</Text>
                </>
                );
            }
            else if (lower === 0 && upper !== 500) {
                return (<>
                    <Text style={styles.subtitleLabel}>Postnatal Age:</Text>
                    <Text style={styles.subtitle}>Less than {upper} days</Text>
                </>
                );
            }
            if (lower !== 0 && upper !== 500) {
                return (<>
                    <Text style={styles.subtitleLabel}>Postnatal Age:</Text>
                    <Text style={styles.subtitle}>{lower} to {upper} days</Text>
                </>
                );   
            }
        }
        else if (!lower && !upper) {
            return null;   
        }
    }
    
    const Condition = ({condition}) => {
        if (condition) {
            return (<>
                <Text style={styles.subtitleLabel}>Condition:</Text>
                <Text style={[styles.subtitle, {fontFamily:"MontserratThick"}, {textDecorationLine: "underline"}, {textDecorationStyle: 'wavy'}]}>{condition}</Text>
            </>
            );   
        }
        else if (!condition) {
            return null;   
        }
    }
    const StorageCondition = ({storage}) => {
        if (storage) {
            return (<>
                <Text style={styles.subtitleLabel}>Storage Condition:</Text>
                <Text style={styles.subtitle}>{storage}</Text>
            </>
            );   
        }
        else if (!storage) {
            return null;
        }
    }
    
    const InfusionRate = ({infusion}) => {
        if (infusion) {
            return (<>
                <Text style={styles.subtitleLabel}>Infusion Rate:</Text>
                <Text style={styles.subtitle}>{infusion}</Text>
            </>
            );   
        }
        else if (!infusion) {
            return null;   
        }
    }
    
    const SolutionComp = ({sol}) => {
        if (sol) {
            return (<>
                <Text style={styles.subtitleLabel}>Solution Compatibility:</Text>
                <Text style={styles.subtitle}>{sol}</Text>
            </>
            );   
        }
        else if (!sol) {
            return null;   
        }
    }

    const Dose = ({lower, upper, unit, dose, roa, freq}) => {
        if (lower || upper) {
            if (!upper) {
                return (<>
                    <Text style={styles.subtitleLabel}>Dose:</Text>
                    <Text style={styles.subtitle}>{(lower*outputWeight).toFixed(2)} {unit==="mg/kg"?"mg":"units"}/{dose} {freq}</Text>
                    <Text style={styles.subtitleLabel}>Standard Dose:</Text>
                    <Text style={styles.subtitle}>{lower} {unit==="mg/kg"?"mg/kg":"units/kg"}/{dose}</Text>
                    <Text style={styles.subtitleLabel}>ROA:</Text>
                    <Text style={styles.subtitle}>{roa}</Text>
                </>
                );
            }
            if (lower && upper) {
                return (<>
                    <Text style={styles.subtitleLabel}>Dose:</Text>
                    <Text style={styles.subtitle}>{(lower*outputWeight).toFixed(2)} to {(upper*outputWeight).toFixed(2)} {unit==="mg/kg"?"mg":"units"}/{dose} {freq}</Text>
                    <Text style={styles.subtitleLabel}>Standard Dose:</Text>
                    <Text style={styles.subtitle}>{(lower)} to {(upper)} {unit==="mg/kg"?"mg/kg":"units/kg"}/{dose}</Text>
                    <Text style={styles.subtitleLabel}>ROA:</Text>
                    <Text style={styles.subtitle}>{roa}</Text>
                </>
            );   
        }
        }
        else if (!lower && !upper) {
            return null;   
        }
    }

    const CRCL = ({lower, upper}) => {
        if (lower !== "" && upper !== "") {
            return (<>
                <Text style={styles.subtitleLabel}>Creatinine Clearance:</Text>
                <Text style={styles.subtitle}>{lower} to {upper} ml/min/1.73m²</Text>
            </>
            );   
        }
        else if (lower === "" && upper === "") {
            return null;
        }
    }

    const Concentration = ({lower, upper, unit, lowerDose, upperDose, doseUnit}) => {
        var ldose=(lowerDose*outputWeight).toFixed(2);
        var udose=(upperDose*outputWeight).toFixed(2);
        if(ldose && (udose && udose !== "0.00" && udose !== 0 && udose !== undefined && udose !== null)) {
            if (lower || upper) {
                if (!upper) {
                    return (<>
                        <Text style={styles.subtitleLabel}>Concentration:</Text>
                        <Text style={styles.subtitle}>For {ldose} {doseUnit} dose: {(ldose/lower).toFixed(2)} ml</Text>
                        <Text style={styles.subtitle}>For {udose} {doseUnit} dose: {(udose/lower).toFixed(2)} ml</Text>
                        <Text style={styles.subtitleLabel}>Standard Concentration:</Text>
                        <Text style={styles.subtitle}>{(lower)} {unit==="mg/ml"?"mg/ml":"units/ml"}</Text>
                    </>
                    );
                }
                if (lower && upper) {
                    return (<>
                        <Text style={styles.subtitleLabel}>Concentration:</Text>
                        <Text style={styles.subtitle}>For {ldose} {doseUnit} dose: {(ldose/upper).toFixed(2)} to {(ldose/lower).toFixed(2)} ml</Text>
                        <Text style={styles.subtitle}>For {udose} {doseUnit} dose: {(udose/upper).toFixed(2)} to {(udose/lower).toFixed(2)} ml</Text>
                        <Text style={styles.subtitleLabel}>Standard Concentration:</Text>
                        <Text style={styles.subtitle}>{(lower)} to {(upper)} {unit==="mg/ml"?"mg/ml":"units/ml"}</Text>
                    </>
                    );   
                }
            }
            else if (!lower && !upper) {
                return null;   
            }
        }
        if(!udose || udose === "0.00" || udose === 0 || udose === undefined || udose === null) {
            if (lower || upper) {
                if (!upper) {
                    return (<>
                        <Text style={styles.subtitleLabel}>Concentration:</Text>
                        <Text style={styles.subtitle}>{(ldose/lower).toFixed(2)} ml</Text>
                        <Text style={styles.subtitleLabel}>Standard Concentration:</Text>
                        <Text style={styles.subtitle}>{(lower)} {unit==="mg/ml"?"mg/ml":"units/ml"}</Text>
                    </>
                    );
                }
                if (lower && upper) {
                    return (<>
                        <Text style={styles.subtitleLabel}>Concentration:</Text>
                        <Text style={styles.subtitle}>{(ldose/upper).toFixed(2)} to {(ldose/lower).toFixed(2)} ml</Text>
                        <Text style={styles.subtitleLabel}>Standard Concentration:</Text>
                        <Text style={styles.subtitle}>{(lower)} to {(upper)} {unit==="mg/ml"?"mg/ml":"units/ml"}</Text>
                    </>
                    );   
                }
            }
            else if (!lower && !upper) {
                return null;   
            }
        }
    }

    const BSA = () => {
        if (weightUnit === "g" && heightUnit === "cm") {
            return Math.sqrt(((weight*height)/3600000)).toFixed(2)
        }
        else if (weightUnit === "g" && heightUnit === "m") {
            return Math.sqrt(((weight*height)/36000)).toFixed(2)
        }
        else if (weightUnit === "kg" && heightUnit === "cm") {
            return Math.sqrt(((weight*height)/3600)).toFixed(2)
        }
        else if (weightUnit === "kg" && heightUnit === "m") {
            return Math.sqrt(((weight*height)/36)).toFixed(2)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.row, {marginTop: 25}]}>
                <View style={[styles.column, {width: "70%"}]}>
                    <Text style={styles.label}>Patient name:</Text>
                    <Text style={styles.bsa}>
                        {patient}
                    </Text>
                </View>
                <View style={[styles.column, {width: "30%"}]}>
                    <Text style={styles.label}>Gender:</Text>
                    <Text style={[styles.bsa, {textAlign: "center"}]}>
                        {gender}
                    </Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.column, {width: "100%"}]}>
                    <Text style={styles.label}>MRD:</Text>
                    <Text style={styles.bsa}>
                        {MRD}
                    </Text>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.column, {width: "33%"}]}>
                    <Text style={styles.label}>BSA:</Text>
                    <Text style={[styles.bsa, {textAlign: "center"}]}>
                        <BSA /> m²
                    </Text>
                </View>
                <View style={[styles.column, {width: "67%"}]}>
                    <Text style={styles.label}>Creatinine Clearance:</Text>
                    <Text style={[styles.crcl, {textAlign: "center"}, {textDecorationLine: "underline"}]}>
                        {creatineClearance} ml/min/1.73m² 
                    </Text>
                </View>
            </View>
            <Text style={styles.title}>{drugs[0]["name_of_the_drug"]}</Text>
            {drugs[0]["dose_type"] === "Renal" &&
                <Text style={styles.doseTypeAlert}>Renal Impairment:{'\n'}Dose Adjustment necessary!</Text>
            }
            {drugs.map((drug, index) => {
                return (
                    <View style={styles.contentContainer} key={index}>
                        <GestationalAge lower={drug["lower_gestational_age"]} upper={drug["upper_gestational_age"]} />
                        <PostnatalAge lower={drug["lower_postnatal_age"]} upper={drug["upper_postnatal_age"]} />
                        <Condition condition={drug["condition"]} />
                        <Dose lower={drug["min_dose"]} upper={drug["max_dose"]} unit={drug["dose_unit"]} dose={drug["dose_days"]} roa={drug["roa"]} freq={drug["frequency"]} />
                        <CRCL lower={drug["min_crcl"]} upper={drug["max_crcl"]} />
                        <Concentration lower={drug["min_concentration"]} upper={drug["max_concentration"]} unit={drug["concentration_unit"]} lowerDose={drug["min_dose"]} upperDose={drug["max_dose"]} doseUnit={drug["dose_unit"]} />
                        <InfusionRate infusion={drug["infusion_rate"]} />
                        <SolutionComp sol={drug["solution_compatibility"]} />
                        <StorageCondition storage={drug["storage"]} />
                    </View>);
            })
            }
            <View style={styles.submitContainer}>
				<TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack()}>
					<Text style={styles.submitText}>Generate New Prescription</Text>
				</TouchableOpacity>
                <TouchableOpacity style={styles.pdfButton} onPress={() => generatePdf()}>
                    <AntDesign style={styles.pdfIcon} name="pdffile1"/>
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
    row: {
        display: "flex",
        flexDirection: "row",
        width: "90%",
        marginTop: 10,
    },
    column: {
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 5,
    },
    label: {
        fontSize: 14,
        paddingHorizontal: 5,
        paddingBottom: 7,
        color: colors.darkColor1,
        fontFamily: "MontserratThick",
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        padding: 5,
        color: colors.darkColor1,
        borderBottomColor: colors.primaryColor,
        borderBottomWidth: 2,
        fontFamily: "MontserratThick",
    },
    doseTypeAlert: {
        fontSize: 17,
        color: "#dc3545",
        fontWeight: "bold",
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: 0.75, height: 0.75},
        textShadowRadius: 2,
        textAlign: "center",
    },
    contentContainer : {
        alignItems: 'center',
        justifyContent: 'center',
        width: "90%",
        borderRadius: 10,
        paddingVertical: 15,
        backgroundColor: colors.white,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.primaryColor,
    },
    bsa: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderRadius: 10,
        paddingVertical: 9,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryColor,
        width: "auto",
        fontFamily: "MontserratBold",
        fontSize: 13,
    },
    crcl: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderRadius: 10,
        paddingVertical: 9,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.primaryColor,
        width: "auto",
        fontSize: 13,
        fontFamily: "MontserratThick",
    },
    subtitle: {
        fontSize: 13,
        marginBottom: 5,
        width: "100%",
        paddingHorizontal: 15,
        fontFamily: "MontserratBold",
    },
    subtitleLabel: {
        fontSize: 14,
        color: colors.darkColor1,
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: 15,
        fontFamily: "MontserratThick",
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    submitContainer: {
		width: "90%",
        marginBottom: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
	},
	submitButton: {
		width: "auto",
		backgroundColor: colors.primaryColor,
		paddingVertical: 15,
        paddingHorizontal: 20,
		borderRadius: 10,
		marginTop: 5,
	},
	submitText: {
		textAlign: "center",
		justifyContent: "center",
		fontSize: 17,
		color: colors.white,
        fontFamily: "MontserratBold",
	},
    pdfButton: {
		width: "auto",
		backgroundColor: colors.primaryColor,
		paddingVertical: 10,
        paddingHorizontal: 10,
		borderRadius: 10,
		marginTop: 5,
	},
    pdfIcon: {
        fontSize: 30,
		color: colors.white,
    },
});