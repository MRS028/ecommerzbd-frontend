import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useUsers,
  useUserStatistics,
  useBanUser,
  useDeleteUser,
} from "@/modules/user/controllers/useUsers";
import {
  UserListQuery,
  Role,
  UserStatus,
} from "@/modules/user/types/user.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AdminUsersPage() {
  const [query, setQuery] = useState<UserListQuery>({ page: 1, limit: 10 });
  const { data, isLoading } = useUsers(query);
  const { data: stats } = useUserStatistics();
  const banUser = useBanUser();
  const deleteUser = useDeleteUser();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link to="/admin/users/new">
          <Button>+ Add User</Button>
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {stats.byStatus?.active ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Blocked</p>
              <p className="text-2xl font-bold">
                {stats.byStatus?.blocked ?? 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">New This Month</p>
              <p className="text-2xl font-bold">{stats.newThisMonth}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search by name or email..."
          className="max-w-xs"
          onChange={(e) =>
            setQuery((q) => ({ ...q, search: e.target.value, page: 1 }))
          }
        />
        <select
          className="border rounded px-3 py-2"
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              role: (e.target.value as Role) || undefined,
              page: 1,
            }))
          }
        >
          <option value="">All Roles</option>
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              status: (e.target.value as UserStatus) || undefined,
              page: 1,
            }))
          }
        >
          <option value="">All Status</option>
          {Object.values(UserStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((u: any) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="font-medium">
                      {u.fullName ||
                        u.name ||
                        `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
                        "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {u.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize">{u.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isDeleted ? "destructive" : "outline"}>
                      {u.isDeleted ? "deleted" : u.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.emailVerified ? "✅" : "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Link to={`/admin/users/${u._id}`}>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => banUser.mutate(u._id)}
                      disabled={u.status === UserStatus.BLOCKED}
                    >
                      Ban
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Delete this user?"))
                          deleteUser.mutate(u._id);
                      }}
                      disabled={u.isDeleted}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages} ·{" "}
            {data.pagination.total} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasPrevPage}
              onClick={() =>
                setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasNextPage}
              onClick={() =>
                setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
