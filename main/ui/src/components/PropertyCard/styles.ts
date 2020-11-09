import { makeStyles, createStyles } from "@material-ui/styles";

export default makeStyles((theme: any) => createStyles({
    card: {
        maxWidth: 400,
        width: 400
    },
    cardMedia: {
        height: 350
    },
    featureChip: {
        margin: theme.spacing(0.5)
    }
}));
