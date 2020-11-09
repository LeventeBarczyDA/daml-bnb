
import React, { useState } from "react";
import Ledger, { CreateEvent } from "@daml/ledger";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { Accept, Decline, Offer, RentalAgreement } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { Button, Container, Grid, Paper } from "@material-ui/core";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import ReviewOfferDialog from "../components/ReviewOfferDialog"
import { formatISO, parseISO } from "date-fns"

interface OfferPropertyCardProps {
    offer: Offer.CreateEvent
    makeOffer: (action: Accept | Decline) => Promise<void>
}

const OfferPropertyCard: React.FC<OfferPropertyCardProps> = ({ offer, makeOffer }) => {
    const [showOfferDialog, setShowOfferDialog] = useState(false)

    async function onDialogClose(action: Accept | Decline | null) {
        if (action !== null) {
            await makeOffer(action)
        }

        setShowOfferDialog(false)
    }

    return (
        <>
            <ReviewOfferDialog property={offer.payload} open={showOfferDialog} offer={offer} onClose={onDialogClose} />
            <PropertyCard property={offer.payload}>
                <Button onClick={() => setShowOfferDialog(true)}>
                    Review Offer
                </Button>
            </PropertyCard>
        </>
    )
}

export default function Bookings() {
    const party = useParty();
    const ledger: Ledger = useLedger();
    const myOffers = useStreamQuery(Offer, () => ({ tenant: party }), []).contracts
    const myRentalAgreements = useStreamQuery(RentalAgreement, () => ({ tenant: party }), []).contracts

    const formatDateString = (date: string) => formatISO(parseISO(date), { representation: 'date' })

    const makeOffer = (offer: Offer.CreateEvent) => async (action: Accept | Decline) => {
        if (action === Accept)
            await ledger.exercise(Offer.Accept, offer.contractId, {})
        else
            await ledger.exercise(Offer.Decline, offer.contractId, {})
    }

    return (
        <>
            {
                myOffers.length > 0 && (
                    <Container>
                        <h2>Offers</h2>
                        <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
                            {myOffers.map(offer => (
                                <Grid item key={offer.contractId}>
                                    <OfferPropertyCard offer={offer} makeOffer={makeOffer(offer)} />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                )
            }
            {
                myRentalAgreements.length > 0 && (
                    <Container>
                        <h2>Rental Agreements</h2>
                        <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
                            {myRentalAgreements.map(rental => (
                                <Grid item key={rental.contractId}>
                                    <PropertyCard property={rental.payload}>
                                        {`Staying between ${formatDateString(rental.payload.start)} and ${formatDateString(rental.payload.end)}`}
                                    </PropertyCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                )
            }
            {
                (!myOffers.length && !myRentalAgreements.length) && (
                    <Container>
                        <Paper>No bookings or agreements</Paper>
                    </Container>
                )
            }
        </>
    )
}