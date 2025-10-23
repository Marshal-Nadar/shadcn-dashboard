import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ExpenseType {
  id: number;
  type_name: string;
  has_subcategory: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

interface Subcategory {
  id: number;
  expense_type_id: number;
  subcategory_name: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

interface ExpenseTypesResponse {
  expenseTypes: ExpenseType[];
}

interface SubcategoriesResponse {
  subcategories: Subcategory[];
}

// Helper functions - moved outside components to make them accessible
const isExpenseTypeActive = (expenseType: ExpenseType): boolean => {
  return expenseType.is_active === 1;
};

const hasSubcategory = (expenseType: ExpenseType): boolean => {
  return expenseType.has_subcategory === 1;
};

const isSubcategoryActive = (subcategory: Subcategory): boolean => {
  return subcategory.is_active === 1;
};

export function ExpenseTypesPage() {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type_name: "",
    has_subcategory: false,
  });
  const navigate = useNavigate();

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required. Please login again.");
      navigate("/auth");
      return null;
    }
    return token;
  };

  // Fetch expense types and subcategories on component mount
  useEffect(() => {
    fetchExpenseTypes();
  }, []);

  useEffect(() => {
    if (expenseTypes.length > 0) {
      fetchAllSubcategories();
    }
  }, [expenseTypes]);

  const fetchExpenseTypes = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/expense-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExpenseTypesResponse = await response.json();
      setExpenseTypes(data.expenseTypes || []);
    } catch (error: any) {
      console.error("Fetch expense types error:", error);
      if (error.message.includes("401")) {
        handleAuthError();
      } else {
        toast.error("Failed to fetch expense types. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubcategories = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      // Since we don't have a direct endpoint for all subcategories,
      // we'll fetch them per expense type that has subcategories
      const expenseTypesWithSubcategories = expenseTypes.filter((et) =>
        hasSubcategory(et)
      );

      const allSubcategories: Subcategory[] = [];
      for (const expenseType of expenseTypesWithSubcategories) {
        const subcats = await fetchSubcategoriesForExpenseType(expenseType.id);
        allSubcategories.push(...subcats);
      }

      setSubcategories(allSubcategories);
    } catch (error) {
      console.error("Fetch subcategories error:", error);
    }
  };

  const fetchSubcategoriesForExpenseType = async (
    expenseTypeId: number
  ): Promise<Subcategory[]> => {
    const token = getAuthToken();
    if (!token) return [];

    try {
      const response = await fetch(
        `http://localhost:3000/api/subcategories/${expenseTypeId}/subcategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubcategoriesResponse = await response.json();
      return data.subcategories || [];
    } catch (error) {
      console.error(
        `Fetch subcategories for expense type ${expenseTypeId} error:`,
        error
      );
      return [];
    }
  };

  const handleAuthError = () => {
    toast.error("Session expired. Please login again.");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getAuthToken();
    if (!token) return;

    if (!formData.type_name.trim()) {
      toast.error("Expense type name is required");
      return;
    }

    try {
      const payload = {
        type_name: formData.type_name,
        has_subcategory: formData.has_subcategory,
      };

      const response = await fetch("http://localhost:3000/api/expense-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(result.message || "Failed to add expense type");
      }

      toast.success("Expense type added successfully");
      resetForm();
      fetchExpenseTypes();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to add expense type");
    }
  };

  const resetForm = () => {
    setFormData({
      type_name: "",
      has_subcategory: false,
    });
  };

  const handleStatusChange = async (
    expenseTypeId: number,
    newStatus: "active" | "inactive"
  ) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const url = `http://localhost:3000/api/expense-types/${expenseTypeId}${
        newStatus === "active" ? "/activate" : ""
      }`;

      const method = newStatus === "active" ? "PATCH" : "DELETE";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(
          result.message ||
            `Failed to ${
              newStatus === "active" ? "activate" : "deactivate"
            } expense type`
        );
      }

      toast.success(
        `Expense type ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`
      );
      fetchExpenseTypes();
    } catch (error: any) {
      console.error("Status change error:", error);
      toast.error(
        error.message ||
          `Failed to ${
            newStatus === "active" ? "activate" : "deactivate"
          } expense type`
      );
    }
  };

  const getSubcategoriesForExpenseType = (
    expenseTypeId: number
  ): Subcategory[] => {
    return subcategories.filter((sub) => sub.expense_type_id === expenseTypeId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Add New Expense Type Form */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Expense Types</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expense Type Name */}
              <div className="space-y-2">
                <Label htmlFor="type_name">
                  Expense Type Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="type_name"
                  value={formData.type_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type_name: e.target.value,
                    }))
                  }
                  placeholder="Enter expense type name"
                  required
                />
              </div>

              {/* Has Subcategory Checkbox */}
              <div className="space-y-2">
                <Label htmlFor="has_subcategory" className="block mb-2">
                  &nbsp;
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_subcategory"
                    checked={formData.has_subcategory}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_subcategory: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="has_subcategory" className="cursor-pointer">
                    Want Subcategory?
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Check className="h-4 w-4 mr-2" />
                {loading ? "Adding..." : "Add Expense Type"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Expense Types List */}
      <Card>
        <CardHeader>
          <CardTitle>All Expense Types (Active & Inactive)</CardTitle>
          <CardDescription>
            Manage your expense types and their subcategories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">S.No</TableHead>
                <TableHead>Expense Type</TableHead>
                <TableHead>Has Subcategory</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : expenseTypes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No expense types found
                  </TableCell>
                </TableRow>
              ) : (
                expenseTypes.map((expenseType, index) => (
                  <ExpenseTypeRow
                    key={expenseType.id}
                    expenseType={expenseType}
                    index={index}
                    subcategories={getSubcategoriesForExpenseType(
                      expenseType.id
                    )}
                    onStatusChange={handleStatusChange}
                    onRefresh={() => {
                      fetchExpenseTypes();
                    }}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Expense Type Row Component
interface ExpenseTypeRowProps {
  expenseType: ExpenseType;
  subcategories: Subcategory[];
  index: number;
  onStatusChange: (id: number, status: "active" | "inactive") => void;
  onRefresh: () => void;
}

function ExpenseTypeRow({
  expenseType,
  subcategories,
  index,
  onStatusChange,
  onRefresh,
}: ExpenseTypeRowProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAuthToken = () => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required. Please login again.");
      navigate("/auth");
      return null;
    }
    return token;
  };

  const handleAuthError = () => {
    toast.error("Session expired. Please login again.");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleAddSubcategory = async (
    expenseTypeId: number,
    expenseTypeName: string
  ) => {
    const subcategoryName = prompt(
      `Enter subcategory name for "${expenseTypeName}":`
    );
    if (!subcategoryName?.trim()) return;

    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/subcategories/${expenseTypeId}/subcategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subcategory_name: subcategoryName }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(result.message || "Failed to add subcategory");
      }

      toast.success("Subcategory added successfully");
      onRefresh();
    } catch (error: any) {
      console.error("Add subcategory error:", error);
      toast.error(error.message || "Failed to add subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpenseType = async (
    expenseTypeId: number,
    currentName: string
  ) => {
    const newName = prompt("Enter new expense type name:", currentName);
    if (!newName?.trim() || newName === currentName) return;

    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/expense-types/${expenseTypeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type_name: newName }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(result.message || "Failed to update expense type");
      }

      toast.success("Expense type updated successfully");
      onRefresh();
    } catch (error: any) {
      console.error("Edit expense type error:", error);
      toast.error(error.message || "Failed to update expense type");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubcategory = async (
    subcategoryId: number,
    currentName: string
  ) => {
    const newName = prompt("Enter new subcategory name:", currentName);
    if (!newName?.trim() || newName === currentName) return;

    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/subcategories/${subcategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subcategory_name: newName }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          return;
        }
        throw new Error(result.message || "Failed to update subcategory");
      }

      toast.success("Subcategory updated successfully");
      onRefresh();
    } catch (error: any) {
      console.error("Edit subcategory error:", error);
      toast.error(error.message || "Failed to update subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryStatusChange = async (
    subcategoryId: number,
    newStatus: "active" | "inactive"
  ) => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      // For subcategories, we only have DELETE (deactivate) endpoint
      // You might want to add activate endpoint for subcategories too
      if (newStatus === "inactive") {
        const response = await fetch(
          `http://localhost:3000/api/subcategories/${subcategoryId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            handleAuthError();
            return;
          }
          throw new Error(result.message || "Failed to deactivate subcategory");
        }

        toast.success("Subcategory deactivated successfully");
        onRefresh();
      } else {
        toast.info("Activate subcategory feature coming soon!");
      }
    } catch (error: any) {
      console.error("Subcategory status change error:", error);
      toast.error(error.message || "Failed to update subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow
      className={!isExpenseTypeActive(expenseType) ? "bg-muted/50" : ""}
    >
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{expenseType.type_name}</span>
          {!isExpenseTypeActive(expenseType) && (
            <Badge variant="secondary" className="text-xs">
              Inactive
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={hasSubcategory(expenseType) ? "default" : "secondary"}>
          {hasSubcategory(expenseType) ? "Yes" : "No"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {subcategories.length > 0 ? (
            subcategories.map((subcat) => (
              <Badge
                key={subcat.id}
                variant={isSubcategoryActive(subcat) ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {subcat.subcategory_name}
                {!isSubcategoryActive(subcat) && (
                  <span className="text-xs">(Inactive)</span>
                )}

                {/* Subcategory Actions */}
                {isExpenseTypeActive(expenseType) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isSubcategoryActive(subcat) ? (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditSubcategory(
                                subcat.id,
                                subcat.subcategory_name
                              )
                            }
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSubcategoryStatusChange(
                                subcat.id,
                                "inactive"
                              )
                            }
                            disabled={loading}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            handleSubcategoryStatusChange(subcat.id, "active")
                          }
                          disabled={loading}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Activate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={isExpenseTypeActive(expenseType)}
            onCheckedChange={(checked) =>
              onStatusChange(expenseType.id, checked ? "active" : "inactive")
            }
            disabled={loading}
          />
          <Badge
            variant={isExpenseTypeActive(expenseType) ? "default" : "secondary"}
          >
            {isExpenseTypeActive(expenseType) ? "Active" : "Inactive"}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {isExpenseTypeActive(expenseType) && (
            <>
              {hasSubcategory(expenseType) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleAddSubcategory(expenseType.id, expenseType.type_name)
                  }
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Sub
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleEditExpenseType(expenseType.id, expenseType.type_name)
                }
                disabled={loading}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant={
              isExpenseTypeActive(expenseType) ? "destructive" : "default"
            }
            size="sm"
            onClick={() =>
              onStatusChange(
                expenseType.id,
                isExpenseTypeActive(expenseType) ? "inactive" : "active"
              )
            }
            disabled={loading}
          >
            {isExpenseTypeActive(expenseType) ? (
              <X className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
