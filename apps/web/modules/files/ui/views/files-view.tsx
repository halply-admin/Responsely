"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import { Button } from "@workspace/ui/components/button";
import { FileIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { UploadDialog } from "../components/upload-dialog";
import { useState } from "react";
import { DeleteFileDialog } from "../components/delete-file-dialog";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { MobileAwareLayout } from "@/modules/dashboard/ui/layouts/mobile-aware-layout";

export const FilesView = () => {
  const isMobile = useIsMobile();
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    {
      initialNumItems: 10,
    },
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  const handleDeleteClick = (file: PublicFile) => {
    setSelectedFile(file);
    setDeleteDialogOpen(true);
  };

  const handleFileDeleted = () => {
    setSelectedFile(null);
  };

  const content = (
    <>
      <DeleteFileDialog
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        file={selectedFile}
        onDeleted={handleFileDeleted}
      />
      <UploadDialog
        onOpenChange={setUploadDialogOpen}
        open={uploadDialogOpen}
      />
      <div className={`flex min-h-screen flex-col bg-muted ${isMobile ? 'p-4' : 'p-8'}`}>
        <div className="mx-auto w-full max-w-screen-md">
          <div className="space-y-2">
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-4xl'}`}>
              Knowledge Base
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
              Upload and manage documents for your AI assistant
            </p>
          </div>

          <div className="mt-8 rounded-lg border bg-background">
            <div className="flex items-center justify-end border-b px-6 py-4">
              <Button
                onClick={() => setUploadDialogOpen(true)}
                size={isMobile ? "sm" : "default"}
              >
                <PlusIcon />
                <span className={isMobile ? "hidden sm:inline" : ""}>Add New</span>
              </Button>
            </div>
            
            {/* Mobile: Card Layout, Desktop: Table Layout */}
            {isMobile ? (
              <div className="divide-y">
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <div className="p-6 text-center">
                        Loading files...
                      </div>
                    );
                  }

                  if (files.results.length === 0) {
                    return (
                      <div className="p-6 text-center text-muted-foreground">
                        No files found
                      </div>
                    );
                  }

                  return files.results.map((file) => (
                    <div key={file.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <FileIcon className="h-5 w-5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="uppercase text-xs" variant="outline">
                                {file.type}
                              </Badge>
                              <span className="text-muted-foreground text-xs">
                                {file.size}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="size-8 p-0"
                              size="sm"
                              variant="ghost"
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteClick(file)}
                            >
                              <TrashIcon className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                    <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                    <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                    <TableHead className="px-6 py-4 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    if (isLoadingFirstPage) {
                      return (
                        <TableRow>
                          <TableCell className="h-24 text-center" colSpan={4}>
                            Loading files...
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (files.results.length === 0) {
                      return (
                        <TableRow>
                          <TableCell className="h-24 text-center" colSpan={4}>
                            No files found
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return files.results.map((file) => (
                      <TableRow className="hover:bg-muted/50" key={file.id}>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileIcon />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className="uppercase" variant="outline">
                            {file.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground">
                          {file.size}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="size-8 p-0"
                                size="sm"
                                variant="ghost"
                              >
                                <MoreHorizontalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClick(file)}
                              >
                                <TrashIcon className="size-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            )}
            
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className="border-t">
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <MobileAwareLayout title="Knowledge Base">
      {content}
    </MobileAwareLayout>
  );
};