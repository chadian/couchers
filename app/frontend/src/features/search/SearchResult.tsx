import { Card, CardContent, Hidden, Typography } from "@material-ui/core";
import Button from "components/Button";
import { CouchIcon, LocationIcon } from "components/Icons";
import UserSummary from "components/UserSummary";
import {
  aboutText,
  hostingStatusLabels,
  meetupStatusLabels,
} from "features/profile/constants";
import { getShowUserOnMap } from "features/search/constants";
import {
  LabelsAgeGenderLanguages,
  LabelsReferencesLastActive,
} from "features/user/UserTextAndLabel";
import { User } from "pb/api_pb";
import LinesEllipsis from "react-lines-ellipsis";
import makeStyles from "utils/makeStyles";
import { firstName } from "utils/names";
import stripMarkdown from "utils/stripMarkdown";

const useStyles = makeStyles((theme) => ({
  link: {
    "&:hover": {
      textDecoration: "none",
    },
    "& h2:hover": {
      textDecoration: "underline",
    },
  },
  about: {
    marginTop: theme.spacing(2),
    marginBottom: 0,
    ...theme.typography.body1,
  },
  statusLabelWrapper: {
    display: "flex",
    color: theme.palette.text.primary,
    "& > div": {
      display: "flex",
    },
    "&:hover": {
      textDecoration: "none",
    },
  },
  statusIcon: {
    marginInlineEnd: theme.spacing(1),
  },
  statusLabel: {
    marginInlineEnd: theme.spacing(2),
  },
  mapButton: {
    display: "block",
    margin: "0 auto",
    marginBlockStart: theme.spacing(1),
  },
}));

interface SearchResultProps {
  className?: string;
  id?: string;
  user: User.AsObject;
  onSelect: (user: User.AsObject) => void;
  highlight?: boolean;
}

export default function SearchResult({
  className,
  id,
  user,
  onSelect,
  highlight = false,
}: SearchResultProps) {
  const classes = useStyles();
  return (
    <Card id={id} className={className} elevation={highlight ? 4 : undefined}>
      <CardContent>
        <UserSummary user={user} titleIsLink compact>
          <div className={classes.statusLabelWrapper}>
            <div>
              <Hidden smDown>
                <CouchIcon className={classes.statusIcon} />
              </Hidden>
              <Typography
                className={classes.statusLabel}
                display="inline"
                variant="body1"
                color="primary"
              >
                {hostingStatusLabels[user.hostingStatus]}
              </Typography>
            </div>
            <div>
              <Hidden smDown>
                <LocationIcon className={classes.statusIcon} />
              </Hidden>
              <Typography
                className={classes.statusLabel}
                display="inline"
                variant="body1"
              >
                {meetupStatusLabels[user.meetupStatus]}
              </Typography>
            </div>
          </div>
        </UserSummary>
        <Hidden mdUp>
          <LinesEllipsis
            text={stripMarkdown(aboutText(user))}
            maxLine={3}
            component="p"
            className={classes.about}
          />
        </Hidden>
        <Hidden smDown>
          <Typography variant="body1" className={classes.about}>
            {stripMarkdown(aboutText(user))}
          </Typography>
          <LabelsAgeGenderLanguages user={user} />
          <LabelsReferencesLastActive user={user} />
        </Hidden>
        <Button
          onClick={() => onSelect(user)}
          variant="outlined"
          className={classes.mapButton}
          size="small"
        >
          {getShowUserOnMap(firstName(user.name))}
        </Button>
      </CardContent>
    </Card>
  );
}
