import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { PropertyKycRequest } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { Party } from "@daml/types";
import { FormControlLabel, Checkbox, FormGroup } from "@material-ui/core";

export interface AddPropertyDialogProps {
    open: boolean
    owner: Party
    operator: Party
    onClose: (state: PropertyKycRequest | null) => Promise<void>
}

const availableFeatures = [
    'Kitchen', 'Wifi', 'Hot tub', 'Pool', 'Washer', 'Hair dryer'
]

export function AddPropertyDialog(props: AddPropertyDialogProps) {
    const [address, setAddress] = useState('')
    const [features, setFeatures] = useState<string[]>([])
    const [poo, setPoo] = useState('')

    function renderFeatures() {
        const updateFeature = (feature: string) => (event: React.ChangeEvent<{}>, checked: boolean) => {
            if (checked) {
                const newFeatures = Array.from(features)
                newFeatures.push(feature)
                setFeatures(newFeatures)
            } else {
                setFeatures(features.filter(f => f !== feature))
            }
        }
        return (
            <>
                <FormControl component='fieldset'>
                    <FormGroup row>
                        {availableFeatures.map(f => (
                            <FormControlLabel
                                key={f}
                                control={<Checkbox checked={features.includes(f)} />}
                                label={f}
                                name={f}
                                onChange={updateFeature(f)}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </>
        )
    }

    const buildRequest: () => PropertyKycRequest = () => ({
        owner: props.owner,
        operator: props.operator,
        address,
        proofOfOwnership: poo,
        features: features.join(',')
    })

    return (
        <Dialog open={props.open} onClose={() => props.onClose(null)} maxWidth="sm" fullWidth>
            <DialogTitle>List Property</DialogTitle>
            <DialogContent>
                <TextField required autoFocus fullWidth key='address' label='Address' type='text' value={address} onChange={e => setAddress(e.target.value)} />
                <TextField required autoFocus fullWidth key='proofOfOwnership' label='Proof of Ownership' type='text' value={poo} onChange={e => setPoo(e.target.value)} />
                {renderFeatures()}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose(null)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={() => props.onClose(buildRequest())} color="primary">
                    List
                </Button>
            </DialogActions>
        </Dialog>
    )
}