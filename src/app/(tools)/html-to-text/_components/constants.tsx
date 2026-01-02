export const DEFAULT_HTML = `
<h1>🚀 Bem-vindo ao MD Editor</h1>
<p>Este é um ambiente de demonstração para testar todas as funcionalidades do editor. Sinta-se à vontade para editar, formatar e exportar este conteúdo.</p>
<h2>1. Admonitions (Callouts)</h2>
<p>O editor suporta blocos de destaque no estilo GitHub Flavored Markdown:</p>
<blockquote>
<p>[!NOTE]<br><strong>Nota:</strong> Admonitions são ótimos para destacar informações contextuais sem interromper o fluxo de leitura.</p>
</blockquote>
<blockquote>
<p>[!TIP]<br><strong>Dica Pro:</strong> Use o atalho <code>Ctrl + Space</code> (ou o menu de ações) para inserir estes blocos rapidamente.</p>
</blockquote>
<blockquote>
<p>[!WARNING]<br><strong>Atenção:</strong> Verifique sempre a visualização final antes de exportar para PDF.</p>
</blockquote>
<h2>2. Formatação de Texto</h2>
<p>Você pode combinar estilos para dar ênfase ao conteúdo:</p>
<ul>
<li><strong>Negrito</strong> para destaque forte.</li>
<li><em>Itálico</em> para ênfase sutil.</li>
<li><del>Texto riscado</del> para itens obsoletos.</li>
<li><code>Código inline</code> para termos técnicos ou atalhos.</li>
</ul>
<h2>3. Gestão de Tarefas</h2>
<p>Acompanhe o progresso do seu projeto diretamente no documento:</p>
<ul>
<li><input checked="" disabled="" type="checkbox"> 🎨 Configurar tema escuro/claro</li>
<li><input checked="" disabled="" type="checkbox"> 🔧 Implementar toolbar flutuante</li>
<li><input checked="" disabled="" type="checkbox"> 📦 Sistema de plugins (Tabelas, Callouts)</li>
<li><input disabled="" type="checkbox"> 🚀 Lançar versão 1.0.0</li>
<li><input disabled="" type="checkbox"> 📝 Escrever documentação técnica</li>
</ul>
<h2>4. Tabelas Ricas</h2>
<p>Tabelas suportam alinhamento de colunas (Esquerda, Centro, Direita):</p>
<table>
<thead>
<tr>
<th align="left">Recurso</th>
<th align="center">Status</th>
<th align="center">Prioridade</th>
<th align="right">Versão</th>
</tr>
</thead>
<tbody><tr>
<td align="left">Exportação PDF</td>
<td align="center">✅ Pronto</td>
<td align="center">Alta</td>
<td align="right">v1.0</td>
</tr>
<tr>
<td align="left">Sincronização Gist</td>
<td align="center">🔄 Em Progresso</td>
<td align="center">Média</td>
<td align="right">v1.1</td>
</tr>
<tr>
<td align="left">Colaboração Real-time</td>
<td align="center">⏳ Planejado</td>
<td align="center">Baixa</td>
<td align="right">v2.0</td>
</tr>
<tr>
<td align="left">Modo Zen</td>
<td align="center">✅ Pronto</td>
<td align="center">Alta</td>
<td align="right">v1.0</td>
</tr>
</tbody></table>
<h2>5. Blocos de Código</h2>
<p>O editor suporta <em>syntax highlighting</em> para diversas linguagens.</p>
<h3>Exemplo em TypeScript (React):</h3>
<pre><code class="language-tsx">import { useState } from &#39;react&#39;
import { Button } from &#39;@/components/ui/button&#39;

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    &lt;div className=&quot;p-4 border rounded-lg&quot;&gt;
      &lt;h3 className=&quot;text-lg font-bold&quot;&gt;Contador: {count}&lt;/h3&gt;
      &lt;div className=&quot;flex gap-2 mt-2&quot;&gt;
        &lt;Button onClick={() =&gt; setCount(c =&gt; c - 1)} variant=&quot;outline&quot;&gt;-&lt;/Button&gt;
        &lt;Button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;+&lt;/Button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}
</code></pre>
<h2>6. Citações e Referências</h2>
<blockquote>
<p>&quot;A simplicidade é o grau máximo de sofisticação.&quot;</p>
<p>— <em>Leonardo da Vinci</em></p>
</blockquote>
<hr>
<h3>Próximos Passos</h3>
<ol>
<li>Tente selecionar este texto e usar a toolbar flutuante.</li>
<li>Exporte este documento clicando no ícone de <strong>PDF</strong> na barra superior.</li>
<li>Importe um arquivo externo via URL para testar o parser.</li>
</ol>
<p><img src="https://placehold.co/800x200/6d28d9/ffffff?text=Markdown+Editor+Pro&font=roboto" alt="Banner"></p>
`
