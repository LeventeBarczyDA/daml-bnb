import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Ledger from "@daml/ledger";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import useStyles from "./styles";
import { PropertyKycRequest } from "@daml.js/damlbnb-0.0.1/lib/Rental";

export default function Verifications() {
    const classes = useStyles();
    const party = useParty();
    const ledger: Ledger = useLedger();
    const pendingProperties = useStreamQuery(PropertyKycRequest, () => ({ operator: party }), []).contracts;

    async function verify(request: PropertyKycRequest.CreateEvent) {
        await ledger.exercise(PropertyKycRequest.VerifyProperty, request.contractId, {})
    }

    return (
        <>
            <h2>Verification Requests</h2>
            <Table size="small">
                <TableHead>
                    <TableRow className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}>Address</TableCell>
                        <TableCell key={1} className={classes.tableCell}>Operator</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pendingProperties.map(p => (
                        <TableRow key={p.contractId} className={classes.tableRow}>
                            <TableCell key={0} className={classes.tableCell}>{p.payload.address}</TableCell>
                            <TableCell key={1} className={classes.tableCell}>{p.payload.operator}</TableCell>
                            <TableCell key={2} className={classes.tableCellButton}>
                                <Button color="primary" className={classes.choiceButton} variant="contained" onClick={() => verify(p)}>Verify</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
