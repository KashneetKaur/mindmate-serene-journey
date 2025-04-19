
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search } from "lucide-react";

// Mock data for medications and pharmacies
const mockMedications = [
  { id: 1, name: "Sertraline", category: "Antidepressant", description: "Treats depression, anxiety, PTSD, and OCD." },
  { id: 2, name: "Escitalopram", category: "Antidepressant", description: "Treats anxiety and major depressive disorder." },
  { id: 3, name: "Lorazepam", category: "Anxiolytic", description: "Short-term relief for anxiety disorders." },
  { id: 4, name: "Bupropion", category: "Antidepressant", description: "Treats depression and seasonal affective disorder." },
  { id: 5, name: "Quetiapine", category: "Antipsychotic", description: "Treats bipolar disorder, depression, and schizophrenia." },
];

const mockPharmacies = [
  { id: 1, name: "Community Pharmacy", address: "123 Main St", distance: "0.5 miles", open: true },
  { id: 2, name: "Wellness Drugstore", address: "456 Oak Ave", distance: "1.2 miles", open: true },
  { id: 3, name: "Health Plus Pharmacy", address: "789 Pine Rd", distance: "1.8 miles", open: false },
  { id: 4, name: "Care Rx", address: "101 Maple Dr", distance: "2.5 miles", open: true },
];

export default function MedicineLocator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("medications");
  
  const filteredMedications = mockMedications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPharmacies = mockPharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medicine Locator</h1>
        <p className="text-muted-foreground">Find mental health medications and nearby pharmacies</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search medications or pharmacies..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="medications" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="pharmacies">Nearby Pharmacies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="space-y-4 mt-4">
          {filteredMedications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No medications found matching your search.</p>
          ) : (
            filteredMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="pharmacies" className="space-y-4 mt-4">
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" /> 
              Using your location: <span className="font-medium">Downtown, City</span>
              <Button variant="link" size="sm" className="ml-auto p-0 h-auto">Update</Button>
            </p>
          </div>
          
          {filteredPharmacies.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No pharmacies found matching your search.</p>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MedicationCardProps {
  medication: {
    id: number;
    name: string;
    category: string;
    description: string;
  }
}

function MedicationCard({ medication }: MedicationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{medication.name}</CardTitle>
            <CardDescription className="mt-1">{medication.category}</CardDescription>
          </div>
          <Button variant="outline" size="sm">Details</Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{medication.description}</p>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="secondary" className="flex-1">Find Nearby</Button>
          <Button size="sm" variant="outline" className="flex-1">Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PharmacyCardProps {
  pharmacy: {
    id: number;
    name: string;
    address: string;
    distance: string;
    open: boolean;
  }
}

function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{pharmacy.name}</CardTitle>
            <CardDescription className="mt-1">{pharmacy.address}</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{pharmacy.distance}</p>
            <p className={`text-xs ${pharmacy.open ? 'text-green-600' : 'text-red-600'}`}>
              {pharmacy.open ? 'Open Now' : 'Closed'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1">
            <MapPin className="h-4 w-4 mr-1" /> Directions
          </Button>
          <Button size="sm" variant="outline" className="flex-1">Call</Button>
        </div>
      </CardContent>
    </Card>
  );
}
