import { useContext } from "react";
import { DrugContext } from "../context/drug-context";

export default function useDrug() {
    return useContext(DrugContext);
}