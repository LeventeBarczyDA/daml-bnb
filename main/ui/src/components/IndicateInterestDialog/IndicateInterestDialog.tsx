import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { IndicationOfInterest, Property } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { useParty } from "@daml/react";
import { Party } from "@daml/types";
import { FormGroup, Select, MenuItem } from "@material-ui/core";
import { formatISO, addDays, parseISO } from 'date-fns'

export interface IndicateInterestDialogProps {
    open: boolean
    tenant: Party
    property: Property.CreateEvent
    onClose: (state: IndicationOfInterest | null) => Promise<void>
}

const availableCurrencies = ['USD', 'GBP', 'EUR', 'CAD', 'BRL', 'COP']

export function IndicateInterestDialog(props: IndicateInterestDialogProps) {
    const party = useParty()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(addDays(new Date(), 5))
    const [message, setMessage] = useState('')
    const [currency, setCurrency] = useState(availableCurrencies[0])
    const { property } = props

    const formatDate = (date: Date) => formatISO(date, { representation: 'date' })
    const parseDate = (str: string) => parseISO(str)

    const buildRequest: () => IndicationOfInterest = () => ({
        tenant: party,
        owner: property.payload.owner,
        address: property.payload.address,
        operator: property.payload.operator,
        // assuming utc is a terrible thing to do
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        currency,
        message
    })

    return (
        <Dialog open={props.open} onClose={() => props.onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Indicate Interest in {property.payload.address}</DialogTitle>
            <DialogContent>
                <FormControl component='fieldset'>
                    <FormGroup row>
                        <TextField
                            type="date"
                            value={formatDate(startDate)}
                            onChange={e => setStartDate(parseDate(e.target.value))} />
                        <TextField
                            type="date"
                            value={formatDate(endDate)}
                            onChange={e => setEndDate(parseDate(e.target.value))} />
                        <Select value={currency} onChange={e => setCurrency(e.target.value as string)}>
                            {availableCurrencies.map(c => (
                                <MenuItem value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormGroup>
                    <FormGroup row>
                        <TextField
                            fullWidth
                            label="Message"
                            multiline
                            rowsMax={3}
                            value={message}
                            onChange={e => setMessage(e.target.value)} />
                    </FormGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose(null)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => props.onClose(buildRequest())} color="primary">
                    Request
                </Button>
            </DialogActions>
        </Dialog>
    )
}