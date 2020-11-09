import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { SetRate } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { Container, MenuItem, Select, TextField } from "@material-ui/core";
import currencies from "../common/currencies"

export interface SetRateDialogProps {
    open: boolean
    address: string
    rateAmount: string | null,
    rateCurrency: string | null,
    onClose: (request: SetRate | null) => Promise<void>
}

const SetRateDialog: React.FC<SetRateDialogProps> = ({ open, onClose, rateAmount, rateCurrency, address }) => {
    const [rate, setRate] = useState(rateAmount ?? '250')
    const [currency, setCurrency] = useState(rateCurrency ?? currencies[0])

    const buildRequest: () => SetRate = () => ({
        rate,
        currency
    })

    return (
        <Dialog open={open} onClose={() => onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>Rate for {address}</DialogTitle>
            <DialogContent>
                <Container>
                    <TextField
                        value={rateAmount}
                        type="number"
                        onChange={e => setRate(e.target.value)}
                    />
                    <Select value={currency} onChange={e => setCurrency(e.target.value as string)}>
                        {currencies.map(c => (
                            <MenuItem value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(null)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => onClose(buildRequest())} color="primary">
                    Set
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SetRateDialog