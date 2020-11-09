import { IndicationOfInterest, Offer, Property, RentalAgreement } from "@daml.js/damlbnb-0.0.1/lib/Rental"
import Ledger from "@daml/ledger"
import React, { useState } from "react"
import PropertyCard from "../PropertyCard/PropertyCard"
import { IndicateInterestDialog } from '../IndicateInterestDialog/IndicateInterestDialog'
import Button from "@material-ui/core/Button";
import { useParty } from "@daml/react"
import { Mail } from "@material-ui/icons"
import { Container } from "@material-ui/core"

export interface PublicPropertyCardProps {
    property: Property.CreateEvent
    ledger: Ledger
    interestRequest: IndicationOfInterest.CreateEvent | undefined
    offer: Offer.CreateEvent | undefined
    rentalAgreement: RentalAgreement.CreateEvent | undefined
}

const PublicPropertyCard: React.FC<PublicPropertyCardProps> = ({ property, ledger, interestRequest, offer, rentalAgreement }) => {
    const party = useParty();
    const [showIndicateInterestDialog, setShowIndicateInterestDialog] = useState(false)

    const indicateInterestClosed = async (request: IndicationOfInterest | null) => {
        if (request) {
            await ledger.create(IndicationOfInterest, request)
        }
        setShowIndicateInterestDialog(false)
    }

    function renderAction() {
        // we currently only allow rental agreement and one request for a property
        // so render the furthest through the walk through
        if (rentalAgreement) {
            return (
                <>You're staying here</>
            )
        } else if (offer) {
            return (
                <>
                <Container>
                    <Mail color="action" />
                    <Button color="primary" onClick={() => setShowIndicateInterestDialog(true)}>
                        Review Rental Offer
                    </Button>
                    </Container>
                </>
            )
        } else if (interestRequest) {
            return (
                <Button color="primary" disabled>
                    Waiting for owner response
                </Button>
            )
        } else {
            return (
                <Button color="primary" onClick={() => setShowIndicateInterestDialog(true)}>
                    I'm interested in staying here!
                </Button>
            )
        }
    }

    return (
        <>
            <IndicateInterestDialog
                property={property}
                open={showIndicateInterestDialog}
                tenant={party}
                onClose={indicateInterestClosed} />
            <PropertyCard property={property.payload}>
                { renderAction() }
            </PropertyCard>
        </>
    )
}

export default PublicPropertyCard