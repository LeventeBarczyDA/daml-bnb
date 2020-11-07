import React from "react";
import Card from "@material-ui/core/Card";
import useStyles from "./styles";
import { CardActionArea, CardActions, CardContent, CardMedia, Chip, Typography } from "@material-ui/core";
import { PropertyDetails } from "../../common/types";


// hashing function from: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const hashStringToNumber = (text: String) => {
    let hash = 0, i, chr;
    for (i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

const generatePropertyImageUrl = (key: String) => {
    // I've stuck a bunch of images from unsplash up on s3 that have been reduced in size
    const availableImageCount = 27
    // Use the key that should be stable to generate a image so we'll always use the same image for the property everywhere
    const hash = hashStringToNumber(key)
    const num = Math.abs(hash) % availableImageCount

    return `https://damlbnb.s3.amazonaws.com/${num}.jpg`
}

export interface PropertyCardProps {
    property: PropertyDetails
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, children }) => {
    const classes = useStyles();
    const { owner, operator, address, features } = property
    const key = `${owner}-${operator}-${address}`

    const renderFeatures = () => {
        return (
            <>
                {features.split(',').map(f => (
                    <Chip key={f} label={f} className={classes.featureChip} />
                ))}
            </>
        )
    }

    return (
        <>
            <Card key={key} className={classes.card}>
                <CardActionArea>
                    <CardMedia image={generatePropertyImageUrl(key)} className={classes.cardMedia} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {address}
                        </Typography>
                        {renderFeatures()}
                    </CardContent>
                    <CardActions>
                        {children}
                    </CardActions>
                </CardActionArea>
            </Card>
        </>
    )
}

export default PropertyCard