import { IndicationOfInterest, MakeAnOffer, Property } from "@daml.js/damlbnb-0.0.1/lib/Rental"
import Ledger from "@daml/ledger"
import React, { useState } from "react"
import PropertyCard from "../PropertyCard/PropertyCard"
import Button from "@material-ui/core/Button";
import { useDablParties } from "../../common/parties";
import { Mail } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import InterestOfferDialog from "../InterestOfferDialog"

interface InterestRequestButtonProps {
    interestRequest: IndicationOfInterest.CreateEvent
    property: Property.CreateEvent
    onMakeOffer: (offer: MakeAnOffer) => Promise<void>
}

const InterestRequestButton: React.FC<InterestRequestButtonProps> = ({ interestRequest, property, onMakeOffer }) => {
    const [open, setOpen] = useState(false)

    async function onClose(request: MakeAnOffer | null) {
        if (request) await onMakeOffer(request)
        setOpen(false)
    }

    return (
        <>
            <InterestOfferDialog
                open={open}
                interestRequest={interestRequest}
                onClose={onClose}
            />
            <IconButton onClick={() => setOpen(true)}>
                <Mail />
            </IconButton>
        </>
    )
}

export interface MyPropertyCardProps {
    property: Property.CreateEvent
    ledger: Ledger
    interestRequests: IndicationOfInterest.CreateEvent[]
}

const MyPropertyCard: React.FC<MyPropertyCardProps> = ({ property, ledger, interestRequests }) => {
    const { parties } = useDablParties()
    const isPublic = !!property.payload.optPublic

    async function toggleVisibility() {
        if (isPublic) {
            await ledger.exercise(Property.Unpublish, property.contractId, {})
        } else {
            await ledger.exercise(Property.Publish, property.contractId, {
                public: parties.publicParty
            })
        }
    }

    async function makeOffer(interestRequest: IndicationOfInterest.CreateEvent, offer: MakeAnOffer) {
        await ledger.exercise(IndicationOfInterest.MakeAnOffer, interestRequest.contractId, offer)
    }

    return (
        <>
            <PropertyCard property={property.payload}>
                {interestRequests.map(interestRequest => (
                    <InterestRequestButton
                        key={interestRequest.contractId}
                        interestRequest={interestRequest}
                        property={property}
                        onMakeOffer={offer => makeOffer(interestRequest, offer)}
                    />
                ))}
                <Button
                    color="primary"
                    onClick={() => toggleVisibility()}
                >{isPublic ? 'Make Private' : 'Make Public'}
                </Button>
            </PropertyCard>
        </>
    )
}

export default MyPropertyCard