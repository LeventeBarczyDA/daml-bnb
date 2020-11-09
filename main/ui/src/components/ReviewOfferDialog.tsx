
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Accept, Decline, Offer, } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { Container } from "@material-ui/core";
import { formatISO, parseISO } from 'date-fns'
import { PropertyDetails } from "../common/types";

export interface InterestOfferDialogProps {
    open: boolean
    property: PropertyDetails
    offer: Offer.CreateEvent
    onClose: (state: Accept | Decline | null) => Promise<void>
}

const ReviewOfferDialog: React.FC<InterestOfferDialogProps> = ({ open, offer, property, onClose }) => {
    const formatDateString = (date: string) => formatISO(parseISO(date), { representation: 'date' })

    const { owner, start, end, address, currency, rate } = offer.payload
    const description = `${owner} has provided an offer for your to stay at ${address} between ${formatDateString(start)} and ${formatDateString(end)} for ${rate}${currency} a night.`

    return (
        <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Offer for {address}</DialogTitle>
            <DialogContent>
                <Container>{description}</Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)} color="secondary">
                    Ignore Offer
                </Button>
                <Button onClick={() => onClose(Decline)} color="primary">
                    Decline
                </Button>
                <Button onClick={() => onClose(Accept)} color="primary">
                    Accept
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ReviewOfferDialog