import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Edit3, LogOut, Save, X } from "lucide-react";

import { PortalLayout } from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/lib/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      {
        title: "Profile — Cornixe Employee Portal",
      },
      {
        name: "description",
        content:
          "Your Cornixe employee details, role and department.",
      },
      {
        property: "og:title",
        content:
          "Profile — Cornixe Employee Portal",
      },
      {
        property: "og:description",
        content:
          "Employee details for the Cornixe Employee Portal.",
      },
    ],
  }),
  component: ProfilePage,
});

type ProfileEmployee = Employee & {
  photo?: string;
};

function getEmployee(): ProfileEmployee | null {
  try {
    const stored =
      localStorage.getItem(
        "cornixe_employee"
      );

    if (!stored) return null;

    return JSON.parse(
      stored
    ) as ProfileEmployee;
  } catch {
    return null;
  }
}

function ProfilePage() {
  const navigate = useNavigate();

  const [employee, setEmployee] =
    useState<ProfileEmployee | null>(
      null
    );

  const [open, setOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState("");

  const [photo, setPhoto] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const currentEmployee =
      getEmployee();

    if (currentEmployee) {
      setEmployee(currentEmployee);
      setName(
        currentEmployee.name || ""
      );
      setPhoto(
        currentEmployee.photo || ""
      );
    }
  }, []);

  if (!employee) {
    return (
      <PortalLayout
        title="Profile"
        description="Your employee details"
      >
        <div className="card-surface mx-auto max-w-2xl p-8 text-center">

          <h2 className="text-lg font-semibold text-foreground">
            Employee information not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in again to access your profile.
          </p>

          <Button
            className="bg-gradient-brand mt-6 text-white hover:opacity-90"
            onClick={() =>
              navigate({ to: "/" })
            }
          >
            Go to Login
          </Button>

        </div>
      </PortalLayout>
    );
  }

  const fields = [
    {
      label: "Employee ID",
      value: employee.employeeId,
    },
    {
      label: "Email",
      value: employee.email,
    },
    {
      label: "Role",
      value: employee.role,
    },
    {
      label: "Department",
      value: employee.department,
    },
  ];

  /* =====================================================
     PHOTO UPLOAD
  ===================================================== */

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Please choose an image smaller than 2 MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const result =
        reader.result;

      if (
        typeof result ===
        "string"
      ) {
        setPhoto(result);
      }
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setSaving(true);

    const updatedEmployee: ProfileEmployee = {
      ...employee,
      name: name.trim(),
      photo,
    };

    localStorage.setItem(
      "cornixe_employee",
      JSON.stringify(
        updatedEmployee
      )
    );

    setEmployee(
      updatedEmployee
    );

    setSaving(false);
    setEditing(false);
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const handleCancel = () => {
    setName(
      employee.name || ""
    );

    setPhoto(
      employee.photo || ""
    );

    setEditing(false);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "cornixe_employee"
    );

    navigate({ to: "/" });
  };

  return (
    <PortalLayout
      title="Profile"
      description="Your employee details"
    >
      <div className="mx-auto max-w-2xl space-y-6">

        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <section className="card-surface overflow-hidden">

          {/* Gradient Header */}

          <div className="bg-gradient-brand h-28" />

          <div className="px-6 pb-6">

            {/* =================================================
                PROFILE PHOTO
            ================================================= */}

            <div className="relative -mt-12 h-24 w-24">

              {photo ? (
                <img
                  src={photo}
                  alt={employee.name}
                  className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-md"
                />
              ) : (
                <div className="bg-gradient-brand flex h-24 w-24 items-center justify-center rounded-full border-4 border-card text-2xl font-semibold text-white shadow-md">
                  {employee.name
                    ?.charAt(0)
                    .toUpperCase() ||
                    "E"}
                </div>
              )}

              {/* Camera button */}

              {editing && (
                <label
                  htmlFor="profile-photo"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-white text-slate-700 shadow-md transition hover:bg-slate-50"
                >
                  <Camera className="h-4 w-4" />

                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handlePhotoChange
                    }
                  />
                </label>
              )}

            </div>

            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="mt-4 flex items-start justify-between gap-4">

              <div className="min-w-0">

                {!editing ? (
                  <>
                    <h2 className="truncate text-xl font-semibold text-foreground">
                      {employee.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {employee.role}
                    </p>
                  </>
                ) : (
                  <div className="w-full max-w-md space-y-2">

                    <Label htmlFor="name">
                      Name
                    </Label>

                    <Input
                      id="name"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      placeholder="Enter your name"
                    />

                  </div>
                )}

              </div>

              {/* Edit button */}

              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditing(true)
                  }
                  className="shrink-0"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}

            </div>

            {/* =================================================
                EDIT PHOTO TEXT
            ================================================= */}

            {editing && (
              <p className="mt-3 text-xs text-muted-foreground">
                Click the camera icon to upload your profile photo.
                Maximum size: 2 MB.
              </p>
            )}

            {/* =================================================
                EMPLOYEE DETAILS
            ================================================= */}

            <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">

              {fields.map(
                (field) => (
                  <div
                    key={
                      field.label
                    }
                    className="min-w-0"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </dt>

                    <dd className="mt-1 truncate text-sm font-medium text-foreground">
                      {field.value ||
                        "—"}
                    </dd>
                  </div>
                )
              )}

            </dl>

            {/* =================================================
                SAVE / CANCEL
            ================================================= */}

            {editing && (
              <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row">

                <Button
                  onClick={
                    handleSave
                  }
                  disabled={saving}
                  className="bg-gradient-brand text-white hover:opacity-90"
                >
                  <Save className="h-4 w-4" />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Button>

                <Button
                  variant="outline"
                  onClick={
                    handleCancel
                  }
                  disabled={saving}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>

              </div>
            )}

          </div>

        </section>

        {/* =================================================
            LOGOUT
        ================================================= */}

        {!editing && (
          <Button
            variant="outline"
            onClick={() =>
              setOpen(true)
            }
            className="w-full sm:w-auto"
          >
            <LogOut />
            Logout
          </Button>
        )}

      </div>

      {/* =====================================================
          LOGOUT CONFIRMATION
      ===================================================== */}

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Log out of the portal?
            </AlertDialogTitle>

            <AlertDialogDescription>
              You will need to sign in again with your Cornixe work
              email to continue.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Stay signed in
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={
                handleLogout
              }
            >
              Logout
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </PortalLayout>
  );
}