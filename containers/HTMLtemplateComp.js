export const GestationalAgeHTML = ({ lower, upper }) => {
    if (lower || upper) {
        if (lower === 0 && upper === 100) {
            return "";
        } else if (upper === 100 && lower !== 0) {
            return (`<div class="row">
                        <div class="label">Gestational Age:</div>
                        <div class="value">Greater than ${lower} weeks</div>
                    </div>
                    `);
        } else if (lower === 0 && upper !== 100) {
            return (`<div class="row">
                        <div class="label">Gestational Age:</div>
                        <div class="value">Less than ${upper} weeks</div>
                    </div>
                    `);
        }
        if (lower !== 0 && upper !== 100) {
            return (`<div class="row">
                        <div class="label">Gestational Age:</div>
                        <div class="value">${lower} to ${upper} weeks</div>
                    </div>
                    `);
        }
    } else if (!lower && !upper) {
        return "";
    }
};

export const PostnatalAgeHTML = ({lower, upper}) => {
    if (lower || upper) {
        if (lower === 0 && upper === 500) {
            return "";
        } else if (upper === 500 && lower !== 0) {
            return (`<div class="row">
                        <div class="label">Postnatal Age:</div>
                        <div class="value">Greater than ${lower} days</div>
                    </div>
                    `);
        } else if (lower === 0 && upper !== 500) {
            return (`<div class="row">
                        <div class="label">Postnatal Age:</div>
                        <div class="value">Less than ${upper} days</div>
                    </div>
                    `);
        }
        if (lower !== 0 && upper !== 500) {
            return (`<div class="row">
                        <div class="label">Postnatal Age:</div>
                        <div class="value">${lower} to ${upper} days</div>
                    </div>
                    `);
        }
    }
    else if (!lower && !upper) {
        return "";   
    }
}

export const ConditionHTML = ({condition}) => {
    if (condition) {
        return (`<div class="row">
                    <div class="label">Condition:</div>
                    <div class="value">${condition}</div>
                </div>
                `);   
    }
    else if (!condition) {
        return "";   
    }
}

export const StorageConditionHTML = ({storage}) => {
    if (storage) {
        return (`<div class="row">
                    <div class="label">Storage Condition:</div>
                    <div class="value">${storage}</div>
                </div>
                `);
    }
    else if (!storage) {
        return "";
    }
}

export const InfusionRateHTML = ({infusion}) => {
    if (infusion) {
        return (`<div class="row">
                    <div class="label">Infusion Rate:</div>
                    <div class="value">${infusion}</div>
                </div>
                `);   
    }
    else if (!infusion) {
        return "";   
    }
}

export const SolutionCompHTML = ({sol}) => {
    if (sol) {
        return (`<div class="row">
                    <div class="label">Solution Compatibility:</div>
                    <div class="value">${sol}</div>
                </div>
                `);   
    }
    else if (!sol) {
        return "";   
    }
}

export const ROAHTML = ({roa}) => {
    if (roa) {
        return (`<div class="row">
                    <div class="label">Route of Administration (ROA):</div>
                    <div class="value">${roa}</div>
                </div>
                `);   
    }
    else if (!roa) {
        return "";   
    }
}

export const CRCLHTML = ({lower, upper}) => {
    if (lower !== "" && upper !== "") {
        return (`<div class="row">
                    <div class="label">Creatinine Clearance:</div>
                    <div class="value">${lower} to ${upper} ml/min/1.73m²</div>
                </div>
                `);   
    }
    else if (lower === "" && upper === "") {
        return "";
    }
}

export const DoseHTML = ({lower, upper, unit, dose, freq, outputWeight}) => {
    if (lower || upper) {
        if (!upper) {
            return (`<div class="row">
                        <div class="label">Dose:</div>
                        <div class="value">${(lower*outputWeight).toFixed(2)} ${unit==="mg/kg"?"mg":"units"}/${dose} ${freq}</div>
                    </div>
                    `);
        }
        if (lower && upper) {
            return (`<div class="row">
                        <div class="label">Dose:</div>
                        <div class="value">${(lower*outputWeight).toFixed(2)} to ${(upper*outputWeight).toFixed(2)} ${unit==="mg/kg"?"mg":"units"}/${dose} ${freq}</div>
                    </div>
                    `);   
    }
    }
    else if (!lower && !upper) {
        return "";   
    }
}

export const StandardDoseHTML = ({lower, upper, unit, dose}) => {
    if (lower || upper) {
        if (!upper) {
            return (`<div class="row">
                        <div class="label">Standard Dose:</div>
                        <div class="value">${(lower)} ${unit==="mg/kg"?"mg/kg":"units/kg"}/${dose}</div>
                    </div>
                    `);
        }
        if (lower && upper) {
            return (`<div class="row">
                        <div class="label">Standard Dose:</div>
                        <div class="value">${(lower)} to ${(upper)} ${unit==="mg/kg"?"mg/kg":"units/kg"}/${dose}</div>
                    </div>
                    `);   
    }
    }
    else if (!lower && !upper) {
        return "";   
    }
}

export const ConcentrationHTML = ({lower, upper, lowerDose, upperDose, doseUnit, outputWeight}) => {
    var ldose=(lowerDose*outputWeight).toFixed(2);
    var udose=(upperDose*outputWeight).toFixed(2);
    if(ldose && (udose && udose !== "0.00" && udose !== 0 && udose !== undefined && udose !== null)) {
        if (lower || upper) {
            if (!upper) {
                return (`<div class="row">
                            <div class="label">Concentration:</div>
                            <div class="value">For ${ldose} ${doseUnit} dose: ${(ldose/lower).toFixed(2)} ml</div>
                            <div class="value">For ${udose} ${doseUnit} dose: ${(udose/lower).toFixed(2)} ml</div>
                        </div>
                        `);
            }
            if (lower && upper) {
                return (`<div class="row">
                            <div class="label">Concentration:</div>
                            <div class="value">For ${ldose} ${doseUnit} dose: ${(ldose/upper).toFixed(2)} to ${(ldose/lower).toFixed(2)} ml</div>
                            <div class="value">For ${udose} ${doseUnit} dose: ${(udose/upper).toFixed(2)} to ${(udose/lower).toFixed(2)} ml</div>
                        </div>
                        `);   
            }
        }
        else if (!lower && !upper) {
            return "";   
        }
    }
    if(!udose || udose === "0.00" || udose === 0 || udose === undefined || udose === null) {
        if (lower || upper) {
            if (!upper) {
                return (`<div class="row">
                            <div class="label">Concentration:</div>
                            <div class="value">${(ldose/lower).toFixed(2)} ml</div>
                        </div>
                        `);
            }
            if (lower && upper) {
                return (`<div class="row">
                            <div class="label">Concentration:</div>
                            <div class="value">${(ldose/upper).toFixed(2)} to ${(ldose/lower).toFixed(2)} ml</div>
                        </div>
                        `);   
            }
        }
        else if (!lower && !upper) {
            return "";   
        }
    }
}

export const StandardConcentrationHTML = ({lower, upper, unit, lowerDose, upperDose, outputWeight}) => {
    var ldose=(lowerDose*outputWeight).toFixed(2);
    var udose=(upperDose*outputWeight).toFixed(2);
    if(ldose && (udose && udose !== "0.00" && udose !== 0 && udose !== undefined && udose !== null)) {
        if (lower || upper) {
            if (!upper) {
                return (`<div class="row">
                            <div class="label">Standard Concentration:</div>
                            <div class="value">${(lower)} ${unit==="mg/ml"?"mg/ml":"units/ml"}</div>
                        </div>
                        `);
            }
            if (lower && upper) {
                return (`<div class="row">
                            <div class="label">Standard Concentration:</div>
                            <div class="value">${(lower)} to ${(upper)} ${unit==="mg/ml"?"mg/ml":"units/ml"}</div>
                        </div>
                        `);   
            }
        }
        else if (!lower && !upper) {
            return "";   
        }
    }
    if(!udose || udose === "0.00" || udose === 0 || udose === undefined || udose === null) {
        if (lower || upper) {
            if (!upper) {
                return (`<div class="row">
                            <div class="label">Standard Concentration:</div>
                            <div class="value">${(lower)} ${unit==="mg/ml"?"mg/ml":"units/ml"}</div>
                        </div>
                        `);
            }
            if (lower && upper) {
                return (`<div class="row">
                            <div class="label">Standard Concentration:</div>
                            <div class="value">${(lower)} to ${(upper)} ${unit==="mg/ml"?"mg/ml":"units/ml"}</div>
                        </div>
                        `);   
            }
        }
        else if (!lower && !upper) {
            return "";   
        }
    }
}

export const RenalTextHTML = (print) => {
    if (print) {
        return (`<div class="renalRow">
                    <div class="renalValue">Renal Impairment: Dose Adjustment necessary!</div>
                </div>
                `);   
    }
    else if (!print) {
        return "";   
    }
}