import { SelectWithFilterComponent } from "@/components/custom-ui/select-with-filter";
import { Label } from "@/components/ui/label";
import { GOOGLE_FONTS } from "@/types/config";

export const FontSelectComponent = ({
  value,
  onChange,
  label,
  key,
}: {
  label: string;
  key: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className={label ? "space-y-2" : ""}>
      {label && <Label htmlFor={key}>{label}</Label>}
      <SelectWithFilterComponent
        key={key}
        id={key}
        data={GOOGLE_FONTS.map((font) => ({
          value: font.value,
          label: font.name,
        }))}
        value={value}
        onChange={(value) => onChange(value)}
      />
    </div>
  );
};