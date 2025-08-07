import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhotoUpload } from './PhotoUpload';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Plus, Edit3, Save, X } from 'lucide-react';

interface AssetData {
  [key: string]: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'file';
  options?: string[];
}

const defaultFields: FormField[] = [
  { id: 'asset', label: 'Asset', type: 'text' },
  { id: 'sno', label: 'S.No.', type: 'text' },
  { id: 'capDate', label: 'Cap.date', type: 'text' },
  { id: 'assetDescription', label: 'Asset Description', type: 'textarea' },
  { id: 'quantity', label: 'Quantity', type: 'number' },
  { id: 'inventoryNumber', label: 'Inventory number', type: 'text' },
  { id: 'depKy', label: 'DepKy', type: 'text' },
  { id: 'costCtr', label: 'Cost Ctr', type: 'text' },
  { id: 'class', label: 'Class', type: 'text' },
  { id: 'use', label: 'Use', type: 'text' },
  { id: 'acquisVal', label: 'Acquis.val.', type: 'number' },
  { id: 'accumDep', label: 'Accum.dep.', type: 'number' },
  { id: 'bookVal', label: 'Book val.', type: 'number' },
  { id: 'crcyCoCd', label: 'Crcy CoCd', type: 'text' },
  { id: 'plateNo', label: 'Plate no.', type: 'text' },
  { id: 'serialNumber', label: 'Serial number', type: 'text' },
  { id: 'ccOwner', label: 'CC owner', type: 'text' },
  { id: 'scopeOfWork', label: 'Scope of work by consultant', type: 'textarea' },
  { id: 'ul', label: 'UL', type: 'text' },
  { id: 'capYear', label: 'Cap year', type: 'number' },
  { id: 'yearFullyDepreciated', label: 'Year to be fully depreciated', type: 'number' },
  { id: 'remainingUEL', label: 'Remaining UEL', type: 'number' },
  { id: 'assetExists', label: 'Does the asset exist?', type: 'select', options: ['Yes', 'No'] },
  { id: 'reasonNotFound', label: 'Reason why asset cannot be found', type: 'textarea' },
  { id: 'assetVisibility', label: 'Asset is visible or integrated into main asset', type: 'select', options: ['Visible', 'Integrated into main asset'] },
  { id: 'assetStatus', label: 'Asset status/condition', type: 'select', options: ['In use', 'Idle'] },
  { id: 'idlePlan', label: 'If the asset is idle - what is the plan for the asset', type: 'textarea' },
  { id: 'assetCondition', label: 'What is the condition of the asset', type: 'select', options: ['Good', 'Poor'] },
  { id: 'conditionDetails', label: 'Condition details (if poor)', type: 'textarea' },
  { id: 'uelAppropriate', label: 'Is the remaining UEL appropriate', type: 'select', options: ['Yes', 'No'] },
  { id: 'uelAdjustment', label: 'UEL adjustment needed', type: 'textarea' },
  { id: 'floodImpacted', label: 'Has the asset been impacted by the flood?', type: 'select', options: ['Yes', 'No'] },
  { id: 'floodDetails', label: 'Flood impact details', type: 'textarea' },
  { id: 'sapChanges', label: 'Any other changes to the SAP details?', type: 'textarea' },
  { id: 'functionalLocation', label: 'Functional location', type: 'text' },
  { id: 'ccChange', label: 'CC change', type: 'text' },
  { id: 'signedBUListing', label: 'Signed BU listing', type: 'text' },
  { id: 'photoHyperlink', label: 'Photo hyperlink', type: 'text' }
];

export const AssetForm: React.FC = () => {
  const [formData, setFormData] = useState<AssetData>({});
  const [assetList, setAssetList] = useState<AssetData[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const { toast } = useToast();

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleFieldLabelEdit = (fieldId: string, newLabel: string) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, label: newLabel } : field
    ));
    setEditingField(null);
  };

  const addNewField = () => {
    if (newFieldLabel.trim()) {
      const newField: FormField = {
        id: `custom_${Date.now()}`,
        label: newFieldLabel,
        type: 'text'
      };
      setFields(prev => [...prev, newField]);
      setNewFieldLabel('');
    }
  };

  const exportToSpreadsheet = () => {
    const allData = [...assetList, formData].filter(data => Object.keys(data).length > 0);
    const csvContent = [
      fields.map(field => field.label).join(','),
      ...allData.map(data => fields.map(field => data[field.id] || '').join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset_verification_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Asset data has been exported to your downloads folder.",
    });
  };

  const importFromSpreadsheet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: AssetData = {};
          headers.forEach((header, index) => {
            const field = fields.find(f => f.label === header.trim());
            if (field) {
              obj[field.id] = values[index]?.trim() || '';
            }
          });
          return obj;
        }).filter(obj => Object.keys(obj).length > 0);
        
        setAssetList(data);
        toast({
          title: "Import Successful",
          description: `Imported ${data.length} assets from spreadsheet.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const selectAssetForVerification = (assetId: string) => {
    const asset = assetList.find((_, index) => index.toString() === assetId);
    if (asset) {
      setFormData(asset);
      setSelectedAsset(assetId);
    }
  };

  const saveCurrentAsset = () => {
    if (selectedAsset) {
      const index = parseInt(selectedAsset);
      setAssetList(prev => prev.map((asset, i) => i === index ? formData : asset));
    } else {
      setAssetList(prev => [...prev, formData]);
    }
    toast({
      title: "Asset Saved",
      description: "Asset verification data has been saved.",
    });
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="min-h-[80px]"
          />
        );
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <CardTitle className="text-2xl font-bold text-center">
            Physical Asset Verification System
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Data Management Section */}
      <Card className="shadow-[var(--shadow-form)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Asset Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="spreadsheet-upload">Import Spreadsheet</Label>
              <Input
                id="spreadsheet-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={importFromSpreadsheet}
                className="cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToSpreadsheet} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={saveCurrentAsset} className="bg-success hover:bg-success/90">
                <Save className="h-4 w-4 mr-2" />
                Save Asset
              </Button>
            </div>
          </div>

          {assetList.length > 0 && (
            <div>
              <Label>Select Asset for Verification</Label>
              <Select value={selectedAsset} onValueChange={selectAssetForVerification}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an asset to verify" />
                </SelectTrigger>
                <SelectContent>
                  {assetList.map((asset, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {asset.asset || asset.inventoryNumber || `Asset ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {assetList.length > 0 && (
            <div className="mt-4">
              <Badge variant="secondary" className="text-sm">
                Total Assets: {assetList.length}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Verification Form */}
      <Card className="shadow-[var(--shadow-form)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Asset Verification Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  {editingField === field.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={field.label}
                        onChange={(e) => handleFieldLabelEdit(field.id, e.target.value)}
                        className="text-sm font-medium"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingField(null)}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingField(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Label className="text-sm font-medium flex-1">{field.label}</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingField(field.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Add New Field */}
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter new field name"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addNewField} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t pt-4">
            <PhotoUpload photos={photos} setPhotos={setPhotos} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};