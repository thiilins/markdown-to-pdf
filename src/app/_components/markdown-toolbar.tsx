"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bold,
  CheckSquare,
  Code,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Sparkles,
  Strikethrough,
  Table,
  Type,
  Undo
} from "lucide-react";
import * as prettierMarkdown from "prettier/plugins/markdown";
import * as prettier from "prettier/standalone";
interface MarkdownToolbarProps {
  editor: any; // Monaco editor instance
}

export function MarkdownToolbar({ editor }: MarkdownToolbarProps) {
  if (!editor) return null;

  const insertText = (before: string, after: string = "", placeholder?: string) => {
    const selection = editor.getSelection();
    if (!selection) return;

    const selectedText = editor.getModel()?.getValueInRange(selection) || "";
    const textToInsert = placeholder && !selectedText
      ? `${before}${placeholder}${after}`
      : `${before}${selectedText}${after}`;

    editor.executeEdits("markdown-format", [
      {
        range: selection,
        text: textToInsert,
      },
    ]);

    // Ajusta a seleção após inserção
    if (placeholder && !selectedText) {
      const newPosition = {
        lineNumber: selection.startLineNumber,
        column: selection.startColumn + before.length + placeholder.length,
      };
      editor.setPosition(newPosition);
      editor.setSelection({
        startLineNumber: newPosition.lineNumber,
        startColumn: newPosition.column - placeholder.length,
        endLineNumber: newPosition.lineNumber,
        endColumn: newPosition.column,
      });
    } else {
      const newPosition = {
        lineNumber: selection.startLineNumber,
        column: selection.startColumn + before.length + selectedText.length + after.length,
      };
      editor.setPosition(newPosition);
    }

    editor.focus();
  };

  const insertAtLineStart = (text: string) => {
    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    const startLine = selection.startLineNumber;
    const endLine = selection.endLineNumber;

    const edits: any[] = [];

    for (let line = startLine; line <= endLine; line++) {
      const lineText = model.getLineContent(line);
      const insertColumn = 1;
      edits.push({
        range: {
          startLineNumber: line,
          startColumn: insertColumn,
          endLineNumber: line,
          endColumn: insertColumn,
        },
        text: text,
      });
    }

    editor.executeEdits("markdown-format", edits);
    editor.focus();
  };

  const insertBlock = (text: string) => {
    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    const startLine = selection.startLineNumber;
    const endLine = selection.endLineNumber;
    const lineCount = endLine - startLine + 1;

    const blockText = text.split("\n");
    const edits: any[] = [];

    // Insere antes da primeira linha
    edits.push({
      range: {
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: startLine,
        endColumn: 1,
      },
      text: blockText.join("\n") + "\n",
    });

    editor.executeEdits("markdown-format", edits);
    editor.focus();
  };

  const insertHeading = (level: number) => {
    const heading = "#".repeat(level) + " ";
    insertAtLineStart(heading);
  };

  const insertTable = () => {
    const table = `| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Linha 1  | Dados    | Dados    |
| Linha 2  | Dados    | Dados    |
`;
    insertBlock(table);
  };

  const insertCodeBlock = () => {
    const codeBlock = `\`\`\`language
código aqui
\`\`\`
`;
    insertBlock(codeBlock);
  };

  const insertCheckbox = () => {
    insertAtLineStart("- [ ] ");
  };

  const insertHorizontalRule = () => {
    insertBlock("---\n");
  };

  const insertPageBreak = () => {
    insertBlock("\n<div class=\"page-break\"></div>\n\n");
  };

  const insertLink = () => {
    insertText("[", "](url)", "texto do link");
  };

  const insertImage = () => {
    insertText("![", "](url)", "texto alternativo");
  };

  const insertBlockquote = () => {
    insertAtLineStart("> ");
  };

  const insertOrderedList = () => {
    insertAtLineStart("1. ");
  };

  const insertUnorderedList = () => {
    insertAtLineStart("- ");
  };

  const undo = () => {
    editor.trigger("keyboard", "undo", null);
  };

  const redo = () => {
    editor.trigger("keyboard", "redo", null);
  };

  const formatDocument = async () => {
    try {
      const model = editor.getModel();
      if (!model) return;

      const content = model.getValue();

      // Formata usando Prettier
      const formatted = await prettier.format(content, {
        parser: "markdown",
        plugins: [prettierMarkdown],
        proseWrap: "preserve",
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
      });

      // Aplica a formatação
      editor.executeEdits("format-document", [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ]);

      editor.focus();
    } catch (error) {
      console.error("Erro ao formatar documento:", error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/30 flex-wrap">
        {/* Cabeçalhos */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heading1 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Cabeçalhos</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => insertHeading(1)}>
              <Heading1 className="h-4 w-4 mr-2" />
              Título 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertHeading(2)}>
              <Heading2 className="h-4 w-4 mr-2" />
              Título 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertHeading(3)}>
              <Heading3 className="h-4 w-4 mr-2" />
              Título 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertHeading(4)}>
              <Heading4 className="h-4 w-4 mr-2" />
              Título 4
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertHeading(5)}>
              <Heading5 className="h-4 w-4 mr-2" />
              Título 5
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertHeading(6)}>
              <Heading6 className="h-4 w-4 mr-2" />
              Título 6
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Formatação de texto */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => insertText("**", "**", "texto em negrito")}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Negrito (Ctrl+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => insertText("*", "*", "texto em itálico")}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Itálico (Ctrl+I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => insertText("~~", "~~", "texto riscado")}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Riscado</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => insertText("`", "`", "código")}
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Código inline</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Links e imagens */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertLink}
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Inserir link</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertImage}
            >
              <Image className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Inserir imagem</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Listas */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertUnorderedList}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Lista não ordenada</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertOrderedList}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Lista ordenada</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertCheckbox}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Checkbox</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Blocos */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertBlockquote}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Citação</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertCodeBlock}
            >
              <Type className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bloco de código</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertTable}
            >
              <Table className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Inserir tabela</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertHorizontalRule}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Linha horizontal</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={insertPageBreak}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Quebra de página</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Desfazer/Refazer */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={undo}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desfazer (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={redo}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refazer (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Formatar Documento */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={formatDocument}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Formatar com Prettier (Shift+Alt+F)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

