import { IndicationOfInterest, MakeAnOffer, Property, SetRate } from "@daml.js/damlbnb-0.0.1/lib/Rental"
import Ledger from "@daml/ledger"
import React, { useState } from "react"
import PropertyCard from "../PropertyCard/PropertyCard"
import Button from "@material-ui/core/Button";
import { useDablParties } from "../../common/parties";
import { Mail } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import InterestOfferDialog from "../InterestOfferDialog"
import SetRateDialog from "../SetRateDialog";

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

    function onClick() {
        // make sure a rate is set before attempting to make an offer
        if (!property.payload.optRate) {
            alert('Please set a rate first')
        } else {
            setOpen(true)
        }
    }

    return (
        <>
            <InterestOfferDialog
                open={open}
                interestRequest={interestRequest}
                onClose={onClose}
            />
            <IconButton onClick={onClick}>
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
    const { optPublic, optRate } = property.payload
    const isPublic = !!optPublic
    const rateText = optRate ? `${optRate._2} ${optRate._1}` : 'No rate set'
    const [setRateDialogOpen, setSetRateDialogOpen] = useState(false)

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

    async function setRateDialogClosed(request: SetRate | null) {
        if (request) {
            await ledger.exercise(Property.SetRate, property.contractId, request)
        }
        setSetRateDialogOpen(false)
    }

    return (
        <>
            <SetRateDialog
                open={setRateDialogOpen}
                onClose={setRateDialogClosed}
                address={property.payload.address}
                rateAmount={property.payload.optRate?._2 || null}
                rateCurrency={property.payload.optRate?._1 || null}
            />
            <PropertyCard property={property.payload}>
                <div>
                    {interestRequests.map(interestRequest => (
                        <InterestRequestButton
                            key={interestRequest.contractId}
                            interestRequest={interestRequest}
                            property={property}
                            onMakeOffer={offer => makeOffer(interestRequest, offer)}
                        />
                    ))}
                </div>
                <div>
                    <Button
                        color="primary"
                        onClick={() => setSetRateDialogOpen(true)}
                    >
                        {rateText}
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => toggleVisibility()}
                    >{isPublic ? 'Make Private' : 'Make Public'}
                    </Button>
                </div>
            </PropertyCard>
        </>
    )
}

export default MyPropertyCard