import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { IndicationOfInterest, MakeAnOffer } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { FormGroup, Container } from "@material-ui/core";
import { formatISO, parseISO } from 'date-fns'

export interface InterestOfferDialogProps {
    open: boolean
    interestRequest: IndicationOfInterest.CreateEvent
    onClose: (state: MakeAnOffer | null) => Promise<void>
}

const InterestOfferDialog: React.FC<InterestOfferDialogProps> = ({ open, interestRequest, onClose }) => {
    const [rate, setRate] = useState(250)

    const formatDateString = (date: string) => formatISO(parseISO(date), { representation: 'date' })

    const buildRequest: () => MakeAnOffer = () => ({
        rate: rate.toString()
    })

    const { tenant, start, end, address, currency } = interestRequest.payload
    const description = `${tenant} would like to stay between ${formatDateString(start)} and ${formatDateString(end)}.`

    return (
        <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Request for {address}</DialogTitle>
            <DialogContent>
                <Container>{description}</Container>
                <Container style={{ paddingTop: 10 }}>
                    <FormGroup>
                        <TextField
                            required
                            label={`Rate (${currency})`}
                            value={rate}
                            type='number'
                            onChange={e => setRate(parseFloat(e.target.value))} />
                    </FormGroup>
                </Container>
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