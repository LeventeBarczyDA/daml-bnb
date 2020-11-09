import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { IndicationOfInterest, MakeAnOffer } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { Container } from "@material-ui/core";
import { formatISO, parseISO } from 'date-fns'

export interface InterestOfferDialogProps {
    open: boolean
    interestRequest: IndicationOfInterest.CreateEvent
    onClose: (state: MakeAnOffer | null) => Promise<void>
}

const InterestOfferDialog: React.FC<InterestOfferDialogProps> = ({ open, interestRequest, onClose }) => {
    const formatDateString = (date: string) => formatISO(parseISO(date), { representation: 'date' })

    const buildRequest: () => MakeAnOffer = () => ({})

    const { tenant, start, end, address } = interestRequest.payload
    const description = `${tenant} would like to stay between ${formatDateString(start)} and ${formatDateString(end)}.`

    return (
        <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Request for {address}</DialogTitle>
            <DialogContent>
                <Container>{description}</Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => onClose(buildRequest())} color="primary">
                    Make An Offer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default InterestOfferDialog