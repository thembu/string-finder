let goal = 'hello world';
let goalInput;
let g;
let population;
let answer;
mutationRate = 0.01;

let HandleInput =  () =>  {

  goal = input.value;
}

function setup() {
  // put setup code here
  createCanvas(400, 400);
  goalInput = createInput(goal);
  goalInput.position(10, height + 10);
  goalInput.size(200);
  setTarget()
  population = new Population();
  population.init();
  
  goalInput.input(setTarget)// Add this line to initialize the population
  g = createP()

}

function setTarget() {
  goal = goalInput.value();
}


function draw() {
  // put drawing code here
  background(0);

  answer =  getAnswer()
  g.html('<br>' + population.getGenerations() + "<br> generations<br>")


  if(answer == goal){
    noLoop();
  }

  fill(255);
  text(answer, 10, 200);

  population.generate();
  //Create next generation
  population.mating();
  // Calculate fitness
  population.calcFitness();

  population.evaluate();

  // If we found the target phrase, stop
  if (population.isFinished()) {
    //println(millis()/1000.0);
    noLoop();
  }
  
}


function setTarget() {

  goal = goalInput.value();
  population = new Population();
  population.init();
  loop();

}

function getAnswer() {
  return  population.getBest();
}


function getRandomChar() {
  let c = floor(random(63, 122));
  if (c === 63) c = 32;
  if (c === 64) c = 46;

  return String.fromCharCode(c);
}


function Dna() {

  this.fitness = 0;
  this.genes = [];

  for (let i = 0; i < goal.length; i++) {
    this.genes[i] = getRandomChar();
  

}


this.getPhrase = function() {
  return this.genes.join("");
}


this.calcFitness = function () {
  let score = 0;
  for (let i = 0; i < this.genes.length; i++) {
    if (this.genes[i] == goal.charAt(i)) {
      score++;
    }
  }
  this.fitness = score / goal.length;
  console.log(this.fitness); // Add this line for debugging
}


this.crossover = function(partner) {
  let child = new Dna();

  let mid = floor(random(this.genes.length));

  for (let i = 0; i < this.genes.length; i++) {
      if (i > mid) {
          child.genes[i] = this.genes[i];
      } else {
          child.genes[i] = partner.genes[i];
      }
  }

  return child;
}


this.mutate = function() {

  for (let i = 0; i < this.genes.length; i++) {
    if (random(1) < mutationRate) {
      this.genes[i] = getRandomChar();
    }
  }
}



}



function Population() {
  this.populationSize = 200;
  this.matingPool;
  this.generations = 0;
  this.finished = false;
  this.perfectScore = 1;
  this.best = "";
  this.population = [];

  // Initialize the population
  for (let i = 0; i < this.populationSize; i++) {
      this.population[i] = new Dna();
  }

  this.init = function() {
    this.matingPool = [];
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness();
  }

  }

  
  this.calcFitness = function () {
      for (let i = 0; i < this.population.length; i++) {
          this.population[i].calcFitness();
      }
  }

  this.generate = function () {
      this.matingPool = [];

      let maxFitness = 0; 
      for (let i = 0; i < this.population.length; i++) {
        this.population[i].calcFitness();
          if (this.population[i].fitness > maxFitness) {
              maxFitness = this.population[i].fitness;
          }
      }

      for (let i = 0; i < this.population.length; i++) {
          let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
          let n = floor(fitness * 100);
          for (let j = 0; j < n; j++) {
              this.matingPool.push(this.population[i]);
          }
      }
  }

  this.mating = function () {
      for (let i = 0; i < this.population.length; i++) {
          // Ensure there are individuals in the mating pool before proceeding
          if (this.matingPool.length > 0) {
              // Select two parents from the mating pool
              let a = floor(random(this.matingPool.length));
              let b = floor(random(this.matingPool.length));
              let partnerA = this.matingPool[a];
              let partnerB = this.matingPool[b];

              // Create a child through crossover
              let child = partnerA.crossover(partnerB);

              // Mutate the child
              child.mutate();

              // Replace the old individual with the new child in the population
              this.population[i] = child;
          } else {
              // Handle the case where the mating pool is empty
              console.error("Mating pool is empty!");
          }
      }

      // Update the population with the new one
      this.generations++;
  }

  this.evaluate = function () {
      let worldrecord = 0.0;
      let index = 0;
      for (let i = 0; i < this.population.length; i++) {
          if (this.population[i].fitness > worldrecord) {
              index = i;
              worldrecord = this.population[i].fitness;
          }
      }

      this.best = this.population[index].getPhrase();
      
  }

  this.getGenerations = function () {
      return this.generations;
  }

  this.getBest = function () {
      return this.best;
  }

  this.isFinished = function () {
      return this.finished;
  }
}
