import React from "react";
import Ledger, { CreateEvent } from "@daml/ledger";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { useStreamQueryAsPublic } from "@daml/dabl-react";
import { IndicationOfInterest, Offer, Property, RentalAgreement } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { Grid } from "@material-ui/core";
import PublicPropertyCard from '../components/PublicPropertyCard/PublicPropertyCard'
import { Party } from "@daml/types";

interface PropertyKeys {
    operator: Party
    owner: Party
    address: string
}

function findForProperty<T extends PropertyKeys, K, I extends string>(property: Property.CreateEvent, items: readonly CreateEvent<T, K, I>[]): CreateEvent<T, K, I> | undefined {
    return items.find(item =>
        property.payload.operator === item.payload.operator
        && property.payload.owner === item.payload.owner
        && property.payload.address === item.payload.address
    )
}

export default function Properties() {
    const party = useParty();
    const ledger: Ledger = useLedger();
    const properties = useStreamQueryAsPublic(Property).contracts
    const myIndicationsOfInterest = useStreamQuery(IndicationOfInterest, () => ({ tenant: party }), []).contracts
    const myOffers = useStreamQuery(Offer, () => ({ tenant: party }), []).contracts
    const myRentals = useStreamQuery(RentalAgreement, () => ({ tenant: party }), []).contracts

    return (
        <>
            <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
                {properties.map(property => (
                    <Grid item key={property.contractId}>
                        <PublicPropertyCard
                            property={property}
                            ledger={ledger}
                            interestRequest={findForProperty(property, myIndicationsOfInterest)}
                            offer={findForProperty(property, myOffers)}
                            rentalAgreement={findForProperty(property, myRentals)}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}