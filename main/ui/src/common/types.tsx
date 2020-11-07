import { Party } from "@daml/types";

export interface PropertyDetails {
    owner: Party
    operator: Party
    address: string
    features: string
}