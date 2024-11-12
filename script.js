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
            cat: d.Genre || "Others", // nomear os gêneros de jogos do eixo x
            valor: +d.Global_Sales,   // vendas globais no eixo y
        }));

        // Ordena as categorias alfabeticamente
        this.barras.sort((a, b) => d3.ascending(a.cat, b.cat));
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
    
        // Escala de cor para as categorias
        this.escalaCor = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(this.barras.map(d => d.cat));
    }

    criaEixos() {
        const eixoX = d3.axisBottom(this.escalaX);
        const eixoY = d3.axisLeft(this.escalaY);
    
        this.margens.append("g")
            .attr("transform", `translate(0, ${this.configuracao.height})`)
            .call(eixoX)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(-45)");
    
        this.margens.selectAll(".linha-horizontal")
            .data(this.escalaY.ticks())
            .enter()
            .append("line")
            .attr("class", "linha-horizontal")
            .attr("x1", 0)
            .attr("x2", this.configuracao.width)
            .attr("y1", d => this.escalaY(d))
            .attr("y2", d => this.escalaY(d))
            .attr("stroke", "#ccc")
            .attr("stroke-dasharray", "2,2");
        
        this.margens.append("g")
            .call(eixoY);

        // Título do eixo X (Gêneros)
        this.svg.append("text")
            .attr("x", this.configuracao.width / 2 + this.configuracao.left)
            .attr("y", this.configuracao.height + this.configuracao.top + 105)
            .style("text-anchor", "middle")
            .text("Gênero");
    
        // Título do eixo Y (Vendas Globais)
        this.svg.append("text")
            .attr("x", -(this.configuracao.height / 2) - this.configuracao.top)
            .attr("y", this.configuracao.left / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Vendas Globais (milhões)");
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
            .attr("fill", d => this.escalaCor(d.cat));  // Aplica a cor baseada na categoria
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
            cx: +d.User_Score * 10,  // Multiplicando por 10 para visualizar melhor
            cy: +d.Critic_Score,         
            r: 4,                     // Raio fixo para os pontos no gráfico
        }));

        this.circulos = this.circulos.slice(0,1500);
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
        const eixoX = d3.axisBottom(this.escalaX).ticks(10).tickFormat(d3.format("d"));
        const eixoY = d3.axisLeft(this.escalaY).ticks(10);

        this.margens.append("g")
            .attr("transform", `translate(0, ${this.configuracao.height})`)
            .call(eixoX);

        this.margens.append("g").call(eixoY);

        this.svg.append("text")
            .attr("x", this.configuracao.width / 2 + this.configuracao.left)
            .attr("y", this.configuracao.height + this.configuracao.top + 60)
            .style("text-anchor", "middle")
            .text("Pontuação dos Usuários");

        this.svg.append("text")
            .attr("x", -(this.configuracao.height / 2) - this.configuracao.top)
            .attr("y", this.configuracao.left / 3)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Pontuação da Crítica");
    }

    carregaCirculos() {
        this.margens.selectAll("circle")
            .data(this.circulos)
            .join("circle")
            .attr("cx", d => this.escalaX(d.cx))
            .attr("cy", d => this.escalaY(d.cy))
            .attr("r", d => d.r)
            .attr("fill", "#DC143C");
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
            .attr("width", this.configuracao.width + this.configuracao.left + this.configuracao.right + 60)
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
                x: +d.NA_Sales, 
                y: +d.EU_Sales, 
                valor: +d.JP_Sales 
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

        // Invertendo a escala do eixo Y para que os valores mais baixos fiquem no topo
        this.escalaY = d3.scaleLinear()
            .domain(yExtent)
            .nice()
            .range([0, this.configuracao.height]);

        this.escalaCores = d3.scaleSequential(d3.interpolateInferno)
            .domain(valorExtent);
    }

    criaEixos() {
        let eixoX = d3.axisBottom(this.escalaX).ticks(10);
        let eixoY = d3.axisLeft(this.escalaY).ticks(10);

        this.margens.append("g")
            .attr("transform", `translate(0, ${this.configuracao.height})`)
            .call(eixoX);

        this.margens.append("g").call(eixoY);

        this.svg.append("text")
            .attr("x", (this.configuracao.width / 2) + this.configuracao.left)
            .attr("y", (this.configuracao.height + this.configuracao.top + 40))
            .style("text-anchor", "middle")
            .text("Vendas na América do Norte (milhões)");

        this.svg.append("text")
            .attr("x", -(this.configuracao.height / 2) - this.configuracao.top)
            .attr("y", (this.configuracao.left / 3))
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Vendas na Europa (milhões)");
    }

    criaGrade() {
        const larguraBin = 10;
        const alturaBin = 10;

        const grid = {};

        this.dados.forEach(d => {
            const xKey = Math.floor(this.escalaX(d.x) / larguraBin);
            const yKey = Math.floor(this.escalaY(d.y) / alturaBin);

            const key = `${xKey},${yKey}`;

            if (!grid[key]) {
                grid[key] = { x: this.escalaX.invert(xKey * larguraBin), y: this.escalaY.invert(yKey * alturaBin), valor: 0 };
            }

            grid[key].valor += d.valor;
        });

        return Object.values(grid);
    }

    carregaMapaDeCalor() {
        const dadosAgrupados = this.criaGrade();

        this.margens.selectAll(".circulo")
            .data(dadosAgrupados)
            .join("circle")
            .attr("class", "circulo")
            .attr("cx", d => this.escalaX(d.x)) 
            .attr("cy", d => this.escalaY(d.y)) 
            .attr("r", 5) 
            .attr("fill", d => this.escalaCores(d.valor)) 
            .attr("opacity", 0.8); // Opacidade de 80% para melhor visualização
    }
}
//------------------------------------------------------
async function main() {

    let barras = { div: "#barras", width: 800, height: 400, top: 40, left: 120, bottom: 200, right: 10};
    let eixoBarras = new GraficoBarras(barras);
    await eixoBarras.carregaArquivo('../datasets/Video_Games_Sales_as_at_22_Dec_2016.csv');
    
    eixoBarras.criaEscalas();
    eixoBarras.criaEixos();
    eixoBarras.carregaBarras();

//------------------------------------------------------
    let dispersao = { div: "#dispersao", width: 1000, height: 450, top: 40, left: 120, bottom: 200, right: 30 };
    let eixoDispersao = new GraficoDispersao(dispersao);
    await eixoDispersao.carregaArquivo('../datasets/Video_Games_Sales_as_at_22_Dec_2016.csv');

    eixoDispersao.criaEscalas();
    eixoDispersao.criaEixos();
    eixoDispersao.carregaCirculos();

//------------------------------------------------------
    let calor = { div: "#mapa-de-calor", width: 800, height: 500, top: 40, left: 120, bottom: 200, right: 30 };
    let eixoCalor = new MapaDeCalor(calor);
    await eixoCalor.carregaArquivo('../datasets/Video_Games_Sales_as_at_22_Dec_2016.csv');

    eixoCalor.criaEscalas();
    eixoCalor.criaEixos();
    eixoCalor.carregaMapaDeCalor();
}

main(); 