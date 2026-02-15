import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ResponsiveSelect({ 
  children, 
  value, 
  onValueChange, 
  placeholder,
  triggerClassName,
  ...props 
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Select value={value} onValueChange={onValueChange} {...props}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 pb-8">
          <div className="space-y-2">
            {React.Children.map(children, (child) => {
              if (child?.type === SelectItem) {
                return (
                  <button
                    key={child.props.value}
                    onClick={() => {
                      onValueChange(child.props.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      value === child.props.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {child.props.children}
                  </button>
                );
              }
              return child;
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { SelectItem };