/*======
   SCRIPT.JS — Portfólio de Vallery Carvalho
   JavaScript puro (Vanilla JS), sem jQuery, React ou qualquer
   biblioteca externa.
 
   Funcionalidades:
   1. Menu responsivo (abrir/fechar em telas pequenas)
   2. Alternância entre tema claro e escuro
   3. Destaque do link da seção que está sendo lida
   4. Contador de caracteres da mensagem
   5. Validação do formulário de contato
   6. Simulação do envio + modal de confirmação
   7. Ano atual no rodapé
 
   O código todo fica dentro do evento DOMContentLoaded para
   garantir que o HTML já esteja carregado antes de procurar
   os elementos na página.
   ============================================================ */
 
document.addEventListener("DOMContentLoaded", function () {
 
 
  var botaoMenu = document.getElementById("botao-menu");
  var menu = document.getElementById("menu");
 
  botaoMenu.addEventListener("click", function () {
    // classList.toggle adiciona a classe se ela não existir e remove se existir
    var aberto = menu.classList.toggle("menu--aberto");
    botaoMenu.classList.toggle("botao-menu--aberto", aberto);
 
    // aria-expanded informa leitores de tela sobre o estado do menu
    botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
  });
 
  // Ao clicar em qualquer link do menu, fecha o painel (útil no celular)
  var linksMenu = document.querySelectorAll(".menu__link");
 
  linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("menu--aberto");
      botaoMenu.classList.remove("botao-menu--aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  });
 
 
  /* ==========================================================
     2. TEMA CLARO / ESCURO
     O tema é controlado pelo atributo data-tema no elemento
     <html>. O CSS define um conjunto de cores diferente para
     data-tema="escuro".
     A escolha é guardada no navegador (localStorage) para
     continuar valendo nas próximas visitas.
     ========================================================== */
 
  var botaoTema = document.getElementById("botao-tema");
  var iconeTema = document.getElementById("icone-tema");
  var textoTema = document.getElementById("texto-tema");
  var raiz = document.documentElement; // elemento <html>
 
  // Lê a preferência salva. O try/catch evita erro caso o
  // navegador esteja com o armazenamento bloqueado.
  var temaSalvo = null;
  try {
    temaSalvo = localStorage.getItem("tema");
  } catch (erro) {
    temaSalvo = null;
  }
 
  // Se não houver preferência salva, usa a configuração do sistema operacional
  if (!temaSalvo) {
    var prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    temaSalvo = prefereEscuro ? "escuro" : "claro";
  }
 
  aplicarTema(temaSalvo);
 
  botaoTema.addEventListener("click", function () {
    var temaAtual = raiz.getAttribute("data-tema");
    aplicarTema(temaAtual === "escuro" ? "claro" : "escuro");
  });
 
  /**
   * Aplica o tema recebido, atualiza o texto do botão e salva a escolha.
   * @param {string} tema - "claro" ou "escuro"
   */
  function aplicarTema(tema) {
    raiz.setAttribute("data-tema", tema);
 
    // O botão sempre mostra o tema para o qual o usuário vai mudar
    if (tema === "escuro") {
      iconeTema.textContent = "☀";
      textoTema.textContent = "Tema claro";
    } else {
      iconeTema.textContent = "☾";
      textoTema.textContent = "Tema escuro";
    }
 
    try {
      localStorage.setItem("tema", tema);
    } catch (erro) {
      // Sem armazenamento disponível: o tema vale só nesta visita.
    }
  }
 
 
  /* ==========================================================
     3. DESTAQUE DO LINK ATIVO
     Usa IntersectionObserver para descobrir qual seção está
     visível e marcar o link correspondente no menu.
     ========================================================== */
 
  var secoes = document.querySelectorAll("main section[id]");
 
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        var id = entrada.target.getAttribute("id");
 
        linksMenu.forEach(function (link) {
          var alvo = link.getAttribute("href") === "#" + id;
          link.classList.toggle("menu__link--ativo", alvo);
        });
      }
    });
  }, {
    // A seção é considerada "ativa" quando cruza a faixa central da tela
    rootMargin: "-45% 0px -50% 0px"
  });
 
  secoes.forEach(function (secao) {
    observador.observe(secao);
  });
 
 
  /* ==========================================================
     4. CONTADOR DE CARACTERES DA MENSAGEM
     ========================================================== */
 
  var campoMensagem = document.getElementById("mensagem");
  var contador = document.getElementById("contador");
 
  campoMensagem.addEventListener("input", function () {
    contador.textContent = campoMensagem.value.trim().length;
  });
 
 
  /* ==========================================================
     5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     Regras aplicadas:
     - nome: obrigatório, mínimo de 3 caracteres
     - e-mail: obrigatório e em formato válido (usuario@dominio.com)
     - mensagem: obrigatória, mínimo de 10 caracteres
     ========================================================== */
 
  var formulario = document.getElementById("formulario-contato");
  var campoNome = document.getElementById("nome");
  var campoEmail = document.getElementById("email");
 
  // Expressão regular: texto + @ + domínio + ponto + extensão com 2 letras ou mais
  var padraoEmail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
 
  formulario.addEventListener("submit", function (evento) {
    // Impede o recarregamento da página, que é o comportamento padrão do formulário
    evento.preventDefault();
 
    limparErros();
 
    var valido = true;
 
    // --- Validação do nome ---
    var nome = campoNome.value.trim();
    if (nome === "") {
      mostrarErro(campoNome, "erro-nome", "Informe seu nome.");
      valido = false;
    } else if (nome.length < 3) {
      mostrarErro(campoNome, "erro-nome", "O nome precisa ter ao menos 3 caracteres.");
      valido = false;
    }
 
    // --- Validação do e-mail ---
    var email = campoEmail.value.trim();
    if (email === "") {
      mostrarErro(campoEmail, "erro-email", "Informe seu e-mail.");
      valido = false;
    } else if (!padraoEmail.test(email)) {
      mostrarErro(campoEmail, "erro-email", "Use um formato válido, como usuario@dominio.com.");
      valido = false;
    }
 
    // --- Validação da mensagem ---
    var mensagem = campoMensagem.value.trim();
    if (mensagem === "") {
      mostrarErro(campoMensagem, "erro-mensagem", "Escreva sua mensagem.");
      valido = false;
    } else if (mensagem.length < 10) {
      mostrarErro(campoMensagem, "erro-mensagem", "A mensagem precisa ter ao menos 10 caracteres.");
      valido = false;
    }
 
    // Se algum campo falhou, leva o foco para o primeiro erro e para por aqui
    if (!valido) {
      var primeiroInvalido = formulario.querySelector(".campo__entrada--invalido");
      if (primeiroInvalido) {
        primeiroInvalido.focus();
      }
      return;
    }
 
    /* ------------------------------------------------------
       6. SIMULAÇÃO DO ENVIO
       Não há servidor os campos são limpos.
       ------------------------------------------------------ */
    formulario.reset();
    contador.textContent = "0";
    abrirModal();
  });
 
  /**
   * Exibe a mensagem de erro de um campo e o marca visualmente.
   * @param {HTMLElement} campo - o input ou textarea
   * @param {string} idErro - id do parágrafo que recebe o texto
   * @param {string} texto - mensagem exibida ao usuário
   */
  function mostrarErro(campo, idErro, texto) {
    document.getElementById(idErro).textContent = texto;
    campo.classList.add("campo__entrada--invalido");
    campo.setAttribute("aria-invalid", "true");
  }
 
  /** Apaga todas as mensagens de erro antes de uma nova validação. */
  function limparErros() {
    document.querySelectorAll(".campo__erro").forEach(function (paragrafo) {
      paragrafo.textContent = "";
    });
 
    document.querySelectorAll(".campo__entrada").forEach(function (campo) {
      campo.classList.remove("campo__entrada--invalido");
      campo.removeAttribute("aria-invalid");
    });
  }
 
 
  var modal = document.getElementById("modal");
  var fecharModalBotao = document.getElementById("fechar-modal");
 
  function abrirModal() {
    modal.classList.add("modal--ativa");
    modal.setAttribute("aria-hidden", "false");
    fecharModalBotao.focus();
  }
 
  function fecharModal() {
    modal.classList.remove("modal--ativa");
    modal.setAttribute("aria-hidden", "true");
  }
 
  fecharModalBotao.addEventListener("click", fecharModal);
 
  // No fundo escuro (fora da caixa branca) também fecha
  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
      fecharModal();
    }
  });
 
  // Tecla Esc fecha o modal
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && modal.classList.contains("modal--ativa")) {
      fecharModal();
    }
  });
 
 
 
  document.getElementById("ano").textContent = new Date().getFullYear();
 
});
 
