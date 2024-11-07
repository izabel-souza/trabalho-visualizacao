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
            cat: d.Genre,
            valor: +d.Global_Sales,
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

//---------------------------------------------------------

class GraficoDispersao {

    constructor(configuracao) {
        this.configuracao = configuracao;
 
        this.svg = null;
        this.margens = null;
 
        this.escalaX = null;
        this.escalaY = null;
 
        this.circulos = [];
 
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
        this.margens = this.svg
            .append("g")
            .attr("transform", `translate(${this.configuracao.left},${this.configuracao.top})`);
    }
 
    async carregaArquivo(file) {
        this.circulos = await d3.csv(file, d => ({
            cx: +d.User_Score,            
            cy: +d.Critic_Score,         
            r: 4,                   // Raio fixo para os pontos no gráfico
        }));

        this.circulos = this.circulos.slice(0,1000);

    }
 
    criaEscalas() {
        const xExtent = d3.extent(this.circulos, d => d.cx);
        const yExtent = d3.extent(this.circulos, d => d.cy);
 
        this.escalaX = d3.scaleLinear()
            .domain(xExtent)
            .nice()
            .range([0, this.configuracao.width]);
 
        this.escalaY = d3.scaleLinear()
            .domain([0, yExtent[1]])
            .nice()
            .range([this.configuracao.height, 0]);
    }
 
    criaEixos() {
        const eixoX = d3.axisBottom(this.escalaX)
        .ticks(10)
        .tickFormat(d3.format("d"));
        const eixoY = d3.axisLeft(this.escalaY).ticks(10);
 
        this.margens
            .append("g")
            .attr("transform", `translate(0, ${this.configuracao.height})`)
            .call(eixoX);
 
        this.margens
            .append("g")
            .call(eixoY);
    }
 
    carregaCirculos() {
        this.margens.selectAll("circle")
            .data(this.circulos)
            .join("circle")
            .attr("cx", d => this.escalaX(d.cx))
            .attr("cy", d => this.escalaY(d.cy))
            .attr("r", d => d.r)
            .attr("fill", "#4a90a0");
    }
 }

//---------------------------------------------------------
class MapaDeCalor {

    constructor(configuracao) {
        this.configuracao = configuracao;

        this.svg = null;
        this.margens = null;

        this.escalaX = null;
        this.escalaY = null;
        this.escalaCores = null;

        this.dados = [];

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
        this.margens = this.svg
            .append("g")
            .attr("transform", `translate(${this.configuracao.left}, ${this.configuracao.top})`);
    }

    async carregaArquivo(file) {
        this.dados = await d3.csv(file, d => {
            return {
                x: +d.NA_Sales, // Eixo X baseado nas vendas na América do Norte
                y: +d.EU_Sales, // Eixo Y baseado nas vendas na Europa
                valor: +d.JP_Sales // Intensidade da cor com base nas vendas no Japão
            };
        });
    }

    criaEscalas() {
        let xExtent = d3.extent(this.dados, d => d.x);
        let yExtent = d3.extent(this.dados, d => d.y);
        let valorExtent = d3.extent(this.dados, d => d.valor);

        this.escalaX = d3.scaleLinear()
            .domain(xExtent)
            .nice()
            .range([0, this.configuracao.width]);

        this.escalaY = d3.scaleLinear()
            .domain(yExtent)
            .nice()
            .range([this.configuracao.height, 0]);

        this.escalaCores = d3.scaleSequential(d3.interpolateInferno)
            .domain(valorExtent);
    }

    criaEixos() {
        let eixoX = d3.axisBottom(this.escalaX).ticks(10);
        let eixoY = d3.axisLeft(this.escalaY).ticks(10);

        this.margens
            .append("g")
            .attr("transform", `translate(0, ${this.configuracao.height})`)
            .call(eixoX);

        this.margens
            .append("g")
            .call(eixoY);
    }

    carregaMapaDeCalor() {
        let raioMax = 10; // Define o tamanho máximo dos círculos

        this.margens.selectAll(".circulo")
            .data(this.dados)
            .join("circle")
            .attr("class", "circulo")
            .attr("cx", d => this.escalaX(d.x))
            .attr("cy", d => this.escalaY(d.y))
            .attr("r", raioMax) // Tamanho dos círculos
            .attr("fill", d => this.escalaCores(d.valor))
            .attr("opacity", 0.8); // Opcional: ajustar a transparência
    }
}


async function main() {
    
//------------------------------------------------------
    let barras = { div: "#barras", width: 1000, height: 500, top: 30, left: 90, bottom: 200, right: 30 };
    let eixoBarras = new GraficoBarras(barras);
    await eixoBarras.carregaArquivo('../datasets/Video_Games_Sales_as_at_22_Dec_2016.csv');
    
    eixoBarras.criaEscalas();
    eixoBarras.criaEixos();
    eixoBarras.carregaBarras();

//------------------------------------------------------
    let dispersao = { div: "#dispersao", width: 1000, height: 500, top: 30, left: 90, bottom: 200, right: 30 };
    let eixoDispersao = new GraficoDispersao(dispersao);
    await eixoDispersao.carregaArquivo('../datasets/Video_Games_Sales_as_at_22_Dec_2016.csv');

    eixoDispersao.criaEscalas();
    eixoDispersao.criaEixos();
    eixoDispersao.carregaCirculos();

//------------------------------------------------------
    let calor = { div: "#mapa-de-calor", width: 800, height: 600, top: 30, left: 50, bottom: 30, right: 30 };
    let eixoCalor = new MapaDeCalor(calor);
    await eixoCalor.carregaArquivo('../datasets/Video_Games_Sales_as_at_22_Dec_2016.csv');

    eixoCalor.criaEscalas();
    eixoCalor.criaEixos();
    eixoCalor.carregaMapaDeCalor();
}

main(); 