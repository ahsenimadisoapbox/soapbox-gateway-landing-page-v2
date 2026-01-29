import { CalibrationEquipmentProvider } from '../../context/CalibrationEquipmentContext';
import { AppLayoutContent } from './AppLayoutContent';

export function CalibrationEquipmentLayout() {
  return (
    <CalibrationEquipmentProvider>
      <AppLayoutContent />
    </CalibrationEquipmentProvider>
  );
}
