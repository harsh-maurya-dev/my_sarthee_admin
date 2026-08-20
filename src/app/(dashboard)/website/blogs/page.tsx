"use client";

import { useState, useMemo } from "react";
import { BlogPost, initialBlogPosts } from "./_data/blogs";
import { AddEditBlogModal } from "./_components/add-edit-blog-modal";
import { BlogViewModal } from "./_components/blog-view-modal";
import { WebsiteNavHeader } from "../_components/website-nav-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Grid,
  List,
  Calendar,
} from "lucide-react";
import { swiftAlert } from "@/lib/swift-alert";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogPosts);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<BlogPost | null>(null);

  const [selectedBlogView, setSelectedBlogView] = useState<BlogPost | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filtered
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchQuery, statusFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setBlogToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setBlogToEdit(blog);
    setIsAddEditOpen(true);
  };

  const handleOpenView = (blog: BlogPost) => {
    setSelectedBlogView(blog);
    setIsViewOpen(true);
  };

  const handleSaveBlog = (savedBlog: BlogPost) => {
    setBlogs((prev) => {
      const exists = prev.some((b) => b.id === savedBlog.id);
      if (exists) {
        return prev.map((b) => (b.id === savedBlog.id ? savedBlog : b));
      }
      return [savedBlog, ...prev];
    });
  };

  const handleTogglePublish = (blog: BlogPost) => {
    const newStatus = blog.status === "Published" ? "Unpublished" : "Published";
    setBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b))
    );

    if (newStatus === "Published") {
      swiftAlert.success({
        title: "Article Published",
        description: `"${blog.title}" is now live on the healthcare portal.`,
      });
    } else {
      swiftAlert.info({
        title: "Article Unpublished",
        description: `"${blog.title}" has been unpublished.`,
      });
    }
  };

  const handleDeleteBlog = (blogId: string, blogTitle: string) => {
    if (confirm(`Are you sure you want to delete blog article "${blogTitle}"?`)) {
      setBlogs((prev) => prev.filter((b) => b.id !== blogId));
      swiftAlert.error({
        title: "Article Deleted",
        description: `Blog post "${blogTitle}" was removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-teal-600" />
            Blog / News Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Publish medical articles, healthcare news, featured images, and publish dates on the public website.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleOpenAdd}
          className="h-9 gap-2 bg-teal-600 text-white hover:bg-teal-700 text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create New Post</span>
        </Button>
      </div>

      {/* Nav Header */}
      {/* <WebsiteNavHeader /> */}

      {/* Filter Bar & View Mode Toggle */}
      <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Blog Title, Author, or Content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium hidden sm:inline">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-9 text-xs w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Unpublished">Unpublished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center border rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 p-0"
              >
                <Grid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-7 w-7 p-0"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlogs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card">
              No blog articles found matching your search.
            </div>
          ) : (
            filteredBlogs.map((b) => (
              <div key={b.id} className="rounded-2xl border bg-card overflow-hidden shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={b.featuredImage}
                      alt={b.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          b.status === "Published"
                            ? "default"
                            : b.status === "Draft"
                              ? "outline"
                              : "secondary"
                        }
                        className="font-bold text-[10px]"
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                      <span>{b.id}</span>
                      <span>Published: {b.publishDate}</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">{b.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {b.content}
                    </p>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block pt-1">
                      By {b.author}
                    </span>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between gap-1.5 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenView(b)}
                    className="h-8 text-xs gap-1 flex-1 border-slate-200"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(b)}
                    className="h-8 text-xs gap-1 border-slate-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePublish(b)}
                    className={`h-8 text-xs gap-1 ${b.status === "Published" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                  >
                    {b.status === "Published" ? "Unpublish" : "Publish"}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBlog(b.id, b.title)}
                    className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
              <TableRow>
                <TableHead className="font-bold text-xs">Featured Image</TableHead>
                <TableHead className="font-bold text-xs">Blog Title & Author</TableHead>
                <TableHead className="font-bold text-xs">Publish Date</TableHead>
                <TableHead className="font-bold text-xs text-center">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.map((b) => (
                <TableRow key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                  <TableCell className="w-24">
                    <img
                      src={b.featuredImage}
                      alt={b.title}
                      className="h-12 w-20 object-cover rounded-lg border"
                    />
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-bold text-foreground block">{b.title}</span>
                    <span className="text-[10px] text-muted-foreground">By {b.author}</span>
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {b.publishDate}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={
                        b.status === "Published"
                          ? "default"
                          : b.status === "Draft"
                            ? "outline"
                            : "secondary"
                      }
                      className="text-[10px] font-bold"
                    >
                      {b.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenView(b)}
                        className="h-8 text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(b)}
                        className="h-8 text-xs gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePublish(b)}
                        className="h-8 text-xs gap-1"
                      >
                        {b.status === "Published" ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBlog(b.id, b.title)}
                        className="h-8 w-8 p-0 text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <AddEditBlogModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        blogToEdit={blogToEdit}
        onSaveBlog={handleSaveBlog}
      />

      <BlogViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        blog={selectedBlogView}
      />
    </div>
  );
}
