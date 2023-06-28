import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Card, CardContent, Grid, IconButton } from "@mui/material";
import { cloneDeep } from "lodash";
import { AppTextField } from "../AppTextField";
import TaxSelector from "../TaxSelector";

interface Props {
  offerService: OfferService;
  update: (next: OfferService) => void;
  disableUp: boolean;
  disableDown: boolean;
  onDelete: () => void;
  moveEntry: (offset: number) => void;
}

export function ServicesWidgetRow({
  offerService,
  disableDown,
  disableUp,
  update,
  moveEntry,
  onDelete,
}: Props) {
  const handleChange = (prop: keyof OfferService) => {
    return function (ev: React.ChangeEvent) {
      const next = cloneDeep(offerService);
      //@ts-ignore
      next[prop] = ev.target.value;
      if (next.quantity && next.unitPrice) {
        next.netto = Number(next.quantity * next.unitPrice);
      }
      if (next.taxRate) {
        next.taxValue = (Number(next.netto || 0) / 100) * next.taxRate;
        next.brutto = Number(next.netto || 0) + Number(next.taxValue || 0);
      }

      update(next);
    };
  };

  const ServiceField = (
    prop: keyof OfferService,
    label: string,
    type?: "number" | "text",
    endAdornment?: string
  ) => {
    return (
      <AppTextField
        label={label}
        value={offerService[prop]}
        onChange={handleChange(prop)}
        type={type}
        InputProps={{ endAdornment }}
      />
    );
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} lg={5}>
            {ServiceField("description", "Leistung")}
          </Grid>
          <Grid item xs={4} sm={2} lg={1}>
            {ServiceField("quantity", "Menge", "number")}
          </Grid>
          <Grid item xs={4} sm={2} lg={1}>
            {ServiceField("unitPrice", "Einzelpreis", "number", "€")}
          </Grid>
          <Grid item xs={4} sm={2} lg={1}>
            {ServiceField("netto", "Netto", "number", "€")}
          </Grid>
          <Grid item xs={6} sm={2} lg={1}>
            <TaxSelector
              value={offerService.taxRate}
              onChange={handleChange("taxRate")}
            />
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <IconButton onClick={() => moveEntry(1)} disabled={disableDown}>
              <KeyboardArrowDownIcon />
            </IconButton>
            <IconButton onClick={() => moveEntry(-1)} disabled={disableUp}>
              <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
