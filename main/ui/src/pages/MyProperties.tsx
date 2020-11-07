import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Ledger from "@daml/ledger";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import useStyles from "./styles";
import { PropertyKycRequest, Property, IndicationOfInterest } from "@daml.js/damlbnb-0.0.1/lib/Rental";
import { AddPropertyDialog } from "../components/AddPropertyDialog/AddPropertyDialog"
import MyPropertyCard from "../components/MyPropertyCard/MyPropertyCard"
import { Grid } from "@material-ui/core";

export default function MyProperties() {
  const classes = useStyles();
  const party = useParty();
  const ledger: Ledger = useLedger();
  const pendingProperties = useStreamQuery(PropertyKycRequest, () => ({ owner: party }), []).contracts
  const listedProperties = useStreamQuery(Property, () => ({ owner: party }), []).contracts
  const interestRequests = useStreamQuery(IndicationOfInterest, () => ({ owner: party }), []).contracts

  const [addPropertyDialogOpen, setAddPropertyDialogOpen] = useState(false);

  const interestRequestsForProperty = (property: Property.CreateEvent) =>
    interestRequests.filter(ir =>
      ir.payload.operator === property.payload.operator
      && ir.payload.address === property.payload.address
    )

  async function addNewPropertyClosed(request: PropertyKycRequest | null): Promise<void> {
    setAddPropertyDialogOpen(false)
    if (!request) return;
    else await ledger.create(PropertyKycRequest, request)
  }

  return (
    <>
      <AddPropertyDialog open={addPropertyDialogOpen} owner={party} operator={party} onClose={addNewPropertyClosed} />
      <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => setAddPropertyDialogOpen(true)}>
        List New Property
      </Button>
      { pendingProperties.length > 0 && (
        <>
          <h2>Pending</h2>
          <Table size="small">
            <TableHead>
              <TableRow className={classes.tableRow}>
                <TableCell key={0} className={classes.tableCell}>Address</TableCell>
                <TableCell key={1} className={classes.tableCell}>Waiting on approval from</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingProperties.map(p => (
                <TableRow key={p.contractId} className={classes.tableRow}>
                  <TableCell key={0} className={classes.tableCell}>{p.payload.address}</TableCell>
                  <TableCell key={1} className={classes.tableCell}>{p.payload.operator}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      <h2>Verified Properties</h2>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
        {listedProperties.map(p => (
          <Grid item key={p.contractId}>
            <MyPropertyCard property={p} ledger={ledger} interestRequests={interestRequestsForProperty(p)} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
