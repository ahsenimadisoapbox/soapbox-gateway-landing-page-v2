import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Equipment } from '../../data/mockData';
import { sites, departments, categories, criticalities } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';

interface EquipmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment;
  mode: 'create' | 'edit' | 'view';
  onSave?: (equipment: Partial<Equipment>) => void;
}

export function EquipmentFormModal({ open, onOpenChange, equipment, mode, onSave }: EquipmentFormModalProps) {
  const [formData, setFormData] = useState<Partial<Equipment>>(
    equipment || {
      name: '',
      assetId: '',
      description: '',
      category: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      location: '',
      site: '',
      department: '',
      criticality: 'medium',
      calibrationInterval: 30,
    }
  );

  const isViewMode = mode === 'view';
  const title = mode === 'create' ? 'Add New Equipment' : mode === 'edit' ? 'Edit Equipment' : 'Equipment Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave?.(formData);
      toast({
        title: mode === 'create' ? 'Equipment Created' : 'Equipment Updated',
        description: `${formData.name} has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new equipment record to the system.' : 
             mode === 'edit' ? 'Update equipment information.' : 
             'View equipment details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Basic Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetId">Asset ID *</Label>
                  <Input
                    id="assetId"
                    value={formData.assetId || ''}
                    onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                    disabled={isViewMode}
                    placeholder="EQ-2024-XXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isViewMode}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isViewMode}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber || ''}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site">Site *</Label>
                  <Select
                    value={formData.site || ''}
                    onValueChange={(value) => setFormData({ ...formData, site: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department || ''}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticality">Criticality *</Label>
                  <Select
                    value={formData.criticality || 'medium'}
                    onValueChange={(value) => setFormData({ ...formData, criticality: value as Equipment['criticality'] })}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {criticalities.map((crit) => (
                        <SelectItem key={crit} value={crit} className="capitalize">{crit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Calibration Settings */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground">Calibration Requirements</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calibrationInterval">Calibration Interval (Days) *</Label>
                  <Input
                    id="calibrationInterval"
                    type="number"
                    value={formData.calibrationInterval || 30}
                    onChange={(e) => setFormData({ ...formData, calibrationInterval: parseInt(e.target.value) })}
                    disabled={isViewMode}
                    min={1}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {mode === 'create' ? 'Create Equipment' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
