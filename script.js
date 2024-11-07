class GraficoBarras {

    constructor(configuracao) {
        this.configuracao = configuracao;
        this.svg = null;
        this.margens = null;
        this.escalaX = null;
        this.escalaY = null;
        this.barras = [];
        this.criaSvg();
        this.criaMargens();
    }

    criaSvg() {
        this.svg = d3.select(this.configuracao.div)
            .append("svg")
            .attr("width", this.configuracao.width + this.configuracao.left + this.configuracao.right)
            .attr("height", this.configuracao.height + this.configuracao.top + this.configuracao.bottom);
    }

    criaMargens() {
        this.margens = this.svg.append("g")
            .attr("transform", `translate(${this.configuracao.left},${this.configuracao.top})`);
    }

    async carregaArquivo(file) {
        this.barras = await d3.csv(file, d => ({
            cat: d.nome,  // Nome correto do campo
            valor: +d.vendas,    // Nome correto do campo
        }));
    }

    criaEscalas() {
        this.escalaX = d3.scaleBand()
            .domain(this.barras.map(d => d.cat))
            .range([0, this.configuracao.width])
            .padding(0.1);
        this.escalaY = d3.scaleLinear()
            .domain([0, d3.max(this.barras, d => d.valor)])
            .nice()
            .range([this.configuracao.height, 0]);
    }

    criaEixos() {
        const eixoX = d3.axisBottom(this.escalaX);
        const eixoY = d3.axisLeft(this.escalaY);

        this.margens.append("g")
        .attr("transform", `translate(0, ${this.configuracao.height})`)
        .call(eixoX)
        .selectAll("text")  // Seleciona todos os textos do eixo X
        .style("text-anchor", "end")  // Define a âncora do texto
        .attr("dx", "-0.8em")         // Desloca um pouco o texto horizontalmente
        .attr("dy", "0.15em")         // Desloca um pouco o texto verticalmente
        .attr("transform", "rotate(-45)");  // Rotaciona o texto para -45 graus

        this.margens.append("g").call(eixoY);
    }

    carregaBarras() {
        this.margens.selectAll(".barra")
            .data(this.barras)
            .join("rect")
            .attr("class", "barra")
            .attr("x", d => this.escalaX(d.cat))
            .attr("y", d => this.escalaY(d.valor))
            .attr("width", this.escalaX.bandwidth())
            .attr("height", d => this.configuracao.height - this.escalaY(d.valor))
            .attr("fill", "#4a90a0");
    }
}

// class Scatterplot {
//     constructor(configuracao) {
//         this.configuracao = configuracao;
//         this.svg = null;
//         this.margens = null;
//         this.escalaX = null;
//         this.escalaY = null;
//         this.circulos = [];
//         this.criaSvg();
//         this.criaMargens();
//     }

//     criaSvg() {
//         this.svg = d3.select(this.configuracao.div)
//             .append("svg")
//             .attr("width", this.configuracao.width + this.configuracao.left + this.configuracao.right)
//             .attr("height", this.configuracao.height + this.configuracao.top + this.configuracao.bottom);
//     }

//     criaMargens() {
//         this.margens = this.svg.append("g")
//             .attr("transform", `translate(${this.configuracao.left},${this.configuracao.top})`);
//     }

//     async carregaArquivo(file) {
//         this.circulos = await d3.csv(file, d => ({
//             cx: +d.CampoX,   // Substitua "CampoX" pelo nome correto
//             cy: +d.CampoY,   // Substitua "CampoY" pelo nome correto
//             col: +d.CampoCor, // Substitua "CampoCor" pelo nome correto
//             cat: d.CampoCategoria, // Substitua "CampoCategoria" pelo nome correto
//             r: 4
//         }));
//     }

//     criaEscalas() {
//         const xExtent = d3.extent(this.circulos, d => d.cx);
//         const yExtent = d3.extent(this.circulos, d => d.cy);
//         const colExtent = d3.extent(this.circulos, d => d.col);

//         this.escalaX = d3.scaleLinear().domain(xExtent).nice().range([0, this.configuracao.width]);
//         this.escalaY = d3.scaleLinear().domain(yExtent).nice().range([this.configuracao.height, 0]);
//         this.escalaCores = d3.scaleSequential(d3.interpolatePuBl).domain(colExtent);
//     }

//     criaEixos() {
//         const eixoX = d3.axisBottom(this.escalaX);
//         const eixoY = d3.axisLeft(this.escalaY);

//         this.margens.append("g")
//             .attr("transform", `translate(0, ${this.configuracao.height})`)
//             .call(eixoX);
//         this.margens.append("g").call(eixoY);
//     }

//     carregaCirculos() {
//         this.margens.selectAll("circle")
//             .data(this.circulos)
//             .join("circle")
//             .attr("cx", d => this.escalaX(d.cx))
//             .attr("cy", d => this.escalaY(d.cy))
//             .attr("r", d => d.r)
//             .attr("fill", d => this.escalaCores(d.col));
//     }
// }

// class MapaDeCalor {

//     constructor(configuracao) {
//         this.configuracao = configuracao;

//         this.svg = null;
//         this.margens = null;

//         this.escalaX = null;
//         this.escalaY = null;

//         this.campos = [];

//         this.criaSvg();
//         this.criaMargens();
//     }

//     criaSvg() {
//         this.svg = d3.select(this.configuracao.div)
//             .append("svg")
//             .attr("x", 10)
//             .attr("y", 10)
//             .attr("width", this.configuracao.width + this.configuracao.left + this.configuracao.right)
//             .attr("height", this.configuracao.height + this.configuracao.top + this.configuracao.bottom)
//     }

//     criaMargens() {
//         this.margens = this.svg
//             .append("g")
//             .attr("transform", `translate(${this.configuracao.left}, ${this.configuracao.top}`)
//     }

//     async carregaArquivo(file) {
//         this.campos = await d3.csv(file, d => {
//             return {
//                 x: +d,//Atributo//,
//                 y: +d,//Atributo//,
//                 valor: +d,//Atributo//
//             };
//         });
//     }

//     criaEscalas() {
//         let xExtent = d3.extent(this.campos, d => d.x);
//         let yExtent = d3.extent(this.campos, d => d.y);
//         let valorExtent = d3.extent(this.dados, d => d.valor);

//         this.escalaX = d3.scaleLinear()
//             .domain(xExtent)
//             .nice()
//             .range([0, this.configuracao.width]);

//         this.escalaY = d3.scaleLinear()
//             .domain(yExtent)
//             .nice()
//             .range([this.configuracao.height, 0]);

//         this.escalaCores = d3.scaleSequential(d3.interpolateInferno)
//             .domain(valorExtent);
//     }


//     criaEixos() {
//         let eixoX = d3.axisBottom(this.escalaX)
//             .ticks(10);
//         let eixoY = d3.axisLeft(this.escalaY)
//             .ticks(10);

//         this.margens
//             .append("g")
//             .attr("transform", `translate(0, ${this.configuracao.height})`)
//             .call(eixoX);

//         this.margens
//             .append("g")
//             .call(eixoY);
//     }

//     carregaMapaDeCalor() {
//         this.margens.selectAll(".celula")
//             .data(this.campos)
//             .join("rect")
//             .attr("class", "celula")
//             .attr("x", d => this.escalaX(d.x))
//             .attr("y", d => this.escalaY(d.y))
//             .attr("width", (this.configuracao.width / (d3.max(this.campos, d => d.x) - d3.min(this.campos, d => d.x))))
//             .attr("height", (this.configuracao.height / (d3.max(this.campos, d => d.y) - d3.min(this.campos, d => d.y))))
//             .attr("fill", d => this.escalaCores(d.valor));
//     }
// }

async function main() {
    
    let barras = { div: "#barras", width: 1000, height: 500, top: 30, left: 90, bottom: 200, right: 30 };
    let eixoBarras = new GraficoBarras(barras);
    await eixoBarras.carregaArquivo('jogos.csv');

    eixoBarras.criaEscalas();
    eixoBarras.criaEixos();
    eixoBarras.carregaBarras();

    // let dispersao = { div: "#dispersao", width: 800, height: 600, top: 30, left: 50, bottom: 30, right: 30 };
    // let eixoDispersao = new Scatterplot(dispersao);
    // await eixoDispersao.carregaArquivo("../00 - datasets/superstore.csv");

    // let calor = { div: "#calor", width: 800, height: 600, top: 30, left: 50, bottom: 30, right: 30 };
    // let eixoCalor = new MapaDeCalor(calor);
    // await eixoCalor.carregaArquivo("../00 - datasets/superstore.csv");

    // eixoDispersao.criaEscalas();
    // eixoDispersao.criaEixos();
    // eixoDispersao.carregaCirculos();


    // eixoCalor.criaEscalas();
    // eixoCalor.criaEixos();
    // eixoCalor.carregaMapaDeCalor();
}

main(); 