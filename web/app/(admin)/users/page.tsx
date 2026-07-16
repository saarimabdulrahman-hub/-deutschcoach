"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active", joined: "2026-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "User", status: "active", joined: "2026-03-20" },
  { id: "3", name: "Charlie Lee", email: "charlie@example.com", role: "User", status: "inactive", joined: "2026-04-10" },
  { id: "4", name: "Diana Park", email: "diana@example.com", role: "Editor", status: "active", joined: "2026-05-01" },
  { id: "5", name: "Eve Martinez", email: "eve@example.com", role: "User", status: "active", joined: "2026-06-15" },
];

const COLUMNS = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  {
    key: "status", label: "Status",
    render: (u: any) => (
      <span style={{
        padding: "2px 10px", borderRadius: "var(--radius-pill)",
        background: u.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
        color: u.status === "active" ? "var(--color-success)" : "var(--color-error-text)",
        fontSize: "var(--type-label-sm)", fontWeight: 600,
      }}>
        {u.status}
      </span>
    ),
  },
  { key: "joined", label: "Joined", sortable: true },
];

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");

  const filtered = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <h1 style={{ fontSize: "var(--type-heading-md)", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>User Management</h1>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="primary" size="sm">+ Invite User</Button>
        </div>
      </div>

      <SearchInput value={query} onChange={setQuery} placeholder="Search users..." variant="table" />

      <Table
        columns={COLUMNS}
        data={filtered}
        getRowKey={(u: any) => u.id}
        emptyMessage="No users found"
      />
    </div>
  );
}
