/*****************************************************************************
 * Constants                                                                 *
 *****************************************************************************/

const ROCK = 'R', PAPER = 'P', SCISSORS = 'S', DYNAMITE = 'D', WATER_BALLOON = 'W', NORMAL = 'X';
const MOVES = [ROCK, PAPER, SCISSORS, DYNAMITE, WATER_BALLOON];

const CLASS = {
    [ROCK]: NORMAL, [PAPER]: NORMAL, [SCISSORS]: NORMAL, [WATER_BALLOON]: WATER_BALLOON, [DYNAMITE]: DYNAMITE
};

const CLASS_RESULTS = {
    [NORMAL]:        { [NORMAL]:  0, [DYNAMITE]: -1, [WATER_BALLOON]:  1},
    [DYNAMITE]:      { [NORMAL]:  1, [DYNAMITE]:  0, [WATER_BALLOON]: -1},
    [WATER_BALLOON]: { [NORMAL]: -1, [DYNAMITE]:  1, [WATER_BALLOON]:  0},
};

const RESULTS = {
    [ROCK]:          { [ROCK]:  0, [PAPER]: -1, [SCISSORS]:  1, [DYNAMITE]: -1, [WATER_BALLOON]:  1},
    [PAPER]:         { [ROCK]:  1, [PAPER]:  0, [SCISSORS]: -1, [DYNAMITE]: -1, [WATER_BALLOON]:  1},
    [SCISSORS]:      { [ROCK]: -1, [PAPER]:  1, [SCISSORS]:  0, [DYNAMITE]: -1, [WATER_BALLOON]:  1},
    [DYNAMITE]:      { [ROCK]:  1, [PAPER]:  1, [SCISSORS]:  1, [DYNAMITE]:  0, [WATER_BALLOON]: -1},
    [WATER_BALLOON]: { [ROCK]: -1, [PAPER]: -1, [SCISSORS]: -1, [DYNAMITE]:  1, [WATER_BALLOON]:  0},
};

const MIXED_NUCLEOTIDES = {
    [ROCK]:          { [ROCK]: 'A', [PAPER]: 'B', [SCISSORS]: 'C', [DYNAMITE]: 'D', [WATER_BALLOON]: 'E'},
    [PAPER]:         { [ROCK]: 'F', [PAPER]: 'G', [SCISSORS]: 'H', [DYNAMITE]: 'I', [WATER_BALLOON]: 'J'},
    [SCISSORS]:      { [ROCK]: 'K', [PAPER]: 'L', [SCISSORS]: 'M', [DYNAMITE]: 'N', [WATER_BALLOON]: 'O'},
    [DYNAMITE]:      { [ROCK]: 'P', [PAPER]: 'Q', [SCISSORS]: 'R', [DYNAMITE]: 'S', [WATER_BALLOON]: 'T'},
    [WATER_BALLOON]: { [ROCK]: 'U', [PAPER]: 'V', [SCISSORS]: 'W', [DYNAMITE]: 'X', [WATER_BALLOON]: 'Y'},
};

const MIXED_CLASS_NUCLEOTIDES = {
    [ROCK]:          { [ROCK]: 'A', [PAPER]: 'A', [SCISSORS]: 'A', [DYNAMITE]: 'B', [WATER_BALLOON]: 'C'},
    [PAPER]:         { [ROCK]: 'A', [PAPER]: 'A', [SCISSORS]: 'A', [DYNAMITE]: 'B', [WATER_BALLOON]: 'C'},
    [SCISSORS]:      { [ROCK]: 'A', [PAPER]: 'A', [SCISSORS]: 'A', [DYNAMITE]: 'B', [WATER_BALLOON]: 'C'},
    [DYNAMITE]:      { [ROCK]: 'D', [PAPER]: 'D', [SCISSORS]: 'D', [DYNAMITE]: 'E', [WATER_BALLOON]: 'F'},
    [WATER_BALLOON]: { [ROCK]: 'G', [PAPER]: 'G', [SCISSORS]: 'G', [DYNAMITE]: 'H', [WATER_BALLOON]: 'I'},
};

const RESULT_NUCLEOTIDES = {
    [ROCK]:          { [ROCK]: 'D', [PAPER]: 'L', [SCISSORS]: 'W', [DYNAMITE]: 'L', [WATER_BALLOON]: 'W'},
    [PAPER]:         { [ROCK]: 'W', [PAPER]: 'D', [SCISSORS]: 'L', [DYNAMITE]: 'L', [WATER_BALLOON]: 'W'},
    [SCISSORS]:      { [ROCK]: 'L', [PAPER]: 'W', [SCISSORS]: 'D', [DYNAMITE]: 'L', [WATER_BALLOON]: 'W'},
    [DYNAMITE]:      { [ROCK]: 'W', [PAPER]: 'W', [SCISSORS]: 'W', [DYNAMITE]: 'D', [WATER_BALLOON]: 'L'},
    [WATER_BALLOON]: { [ROCK]: 'L', [PAPER]: 'L', [SCISSORS]: 'L', [DYNAMITE]: 'W', [WATER_BALLOON]: 'D'},
};

const MAX_DYNAMITES = 100;
const WINNING_SCORE = 1000;

/*****************************************************************************
 * Utilities                                                                 *
 *****************************************************************************/

const randomNumber = limit =>
    Math.floor(limit * Math.random());

const randomChoice = arr =>
    arr[randomNumber(arr.length)];

const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
};

const indexOfMax = arr =>
    arr.reduce((maxIdx, curr, currIdx, a) => curr > arr[maxIdx] ? currIdx : maxIdx, 0);

const objectMap = mapper => obj =>
    Object.assign({}, ...Object.keys(obj).map(k => ({[k]: mapper(obj[k])})));

/*****************************************************************************
 * Move mappers                                                              *
 *****************************************************************************/

const randomRpsMove = () =>
    randomChoice([ROCK, PAPER, SCISSORS]);

const aMoveThatBeats = move =>
    randomChoice(MOVES.filter(m => m !== DYNAMITE && RESULTS[m][move] === 1));

const classWinMapper = clazz =>
    clazz === DYNAMITE ? WATER_BALLOON : (clazz === WATER_BALLOON ? NORMAL : DYNAMITE);

const rpsWinMapper = move =>
    move === ROCK ? PAPER : (move === PAPER ? SCISSORS : ROCK);

const wToXWinMapper = x => move =>
    move === DYNAMITE ? WATER_BALLOON : (move === WATER_BALLOON ? x : rpsWinMapper(move));

const wToRWinMapper = wToXWinMapper(ROCK);
const wToPWinMapper = wToXWinMapper(PAPER);
const wToSWinMapper = wToXWinMapper(SCISSORS);

/*****************************************************************************
 * Result determiners                                                        *
 *****************************************************************************/

const urMovePredictionResultDeterminer = actualUrMove =>
    pMove => {
        if (pMove === actualUrMove) {
            return 1;
        } else if (pMove === WATER_BALLOON) {
            if (actualUrMove !== DYNAMITE) {
                return 0;
            } else {
                return -1;
            }
        } else if (pMove === DYNAMITE) {
            if (actualUrMove === WATER_BALLOON) {
                return 0;
            } else {
                return -1;
            }
        } else {
            if (RESULTS[actualUrMove][pMove] === 1) {
                return 0;
            } else {
                return -1;
            }
        }
    };

const myMovePredictionResultDeterminer = actualUrMove =>
    pMove => {
        if (actualUrMove === DYNAMITE) {
            return -1;
        } else {
            return RESULTS[actualUrMove][pMove];
        }
    };

const urSpecialsPredictionResultDeterminer = actualUrMove =>
    pClass => {
        if (actualUrMove === DYNAMITE) {
            return pClass === DYNAMITE ? 1 : -1;
        } else if (actualUrMove === WATER_BALLOON) {
            return pClass === WATER_BALLOON ? 1 : 0;
        } else {
            return pClass === DYNAMITE ? -1 : 0;
        }
    };

const urDrawPredictionResultDeterminer = actualUrMove =>
    pClass => {
        const classResult = CLASS_RESULTS[CLASS[actualUrMove]][pClass];
        return classResult === 0 ? 1 : (classResult === 1 ? 0 : -2);
    };

const myDrawPredictionResultDeterminer = actualUrMove =>
    pClass => {
        const classResult = CLASS_RESULTS[CLASS[actualUrMove]][pClass];
        return classResult === 1 ? 1 : (classResult === -1 ? 0 : -2);
    };

/*****************************************************************************
* DNA predictor utilities                                                    *
******************************************************************************/

const indexOfRecentGene = (strand, maxGeneLength) => {
    for (let geneLength = maxGeneLength; geneLength > 0; geneLength--) {
        if (geneLength >= strand.length) { continue; }
        const gene = strand.slice(-geneLength);
        const index = strand.lastIndexOf(gene, strand.length - geneLength - 1);
        if (index != -1) { return index + geneLength; }
    }

    return -1;
};

/*****************************************************************************
 * DNA predictor transformers                                                *
 *****************************************************************************/

const extractUrs = dnaPredictor =>
    dna => dnaPredictor(dna).urs;

const extractMine = dnaPredictor =>
    dna => dnaPredictor(dna).mine;

const mappingTransformer = mapper => dnaPredictor =>
    dna => objectMap(mapper)(dnaPredictor(dna));

const wToRRotator = mappingTransformer(wToRWinMapper);
const wToPRotator = mappingTransformer(wToPWinMapper);
const wToSRotator = mappingTransformer(wToSWinMapper);
const classRotator = mappingTransformer(classWinMapper);

const multipleTransformer = n => transformer => dnaPredictor =>
    dna => (Array(n).fill().reduce((acc, _) => transformer(acc), dnaPredictor))(dna);

/*****************************************************************************
 * Move DNA predictors                                                       *
 *****************************************************************************/

const movePredictionFromIndex = (index, moveDna) => {
    if (index > -1) {
        return { mine: moveDna.getMyMove(index), urs: moveDna.getUrMove(index) };
    } else {
        return { mine: randomRpsMove(), urs: randomRpsMove() };
    }
};

const myDnaMovePredictor = maxGeneLength => moveDna => {
    const index = indexOfRecentGene(moveDna.myStrand, maxGeneLength);
    return movePredictionFromIndex(index, moveDna);
};

const urDnaMovePredictor = maxGeneLength => moveDna => {
    const index = indexOfRecentGene(moveDna.urStrand, maxGeneLength);
    return movePredictionFromIndex(index, moveDna);
};

const resultDnaMovePredictor = maxGeneLength => moveDna => {
    const index = indexOfRecentGene(moveDna.resultStrand, maxGeneLength);
    return movePredictionFromIndex(index, moveDna);
};

const mixedDnaMovePredictor = maxGeneLength => moveDna => {
    const index = indexOfRecentGene(moveDna.mixedStrand, maxGeneLength);
    return movePredictionFromIndex(index, moveDna);
};

const baseMoveDnaPredictors = [myDnaMovePredictor, urDnaMovePredictor, resultDnaMovePredictor, mixedDnaMovePredictor]
    .map(dpf => [2, 3, 5, 8, 13].map(pl => dpf(pl)))
    .reduce((acc, curr) => acc.concat(curr), []);

const moveDnaPredictorTransformers = [wToRRotator, wToPRotator, wToSRotator]
    .map(transformer => [0, 1, 2].map(n => multipleTransformer(n)(transformer)))
    .reduce((acc, curr) => acc.concat(curr), []);

const allMoveDnaPredictors = baseMoveDnaPredictors
    .map(dp => moveDnaPredictorTransformers.map(trans => trans(dp)))
    .reduce((acc, curr) => acc.concat(curr), []);

/*****************************************************************************
* Specials DNA predictors                                                    *
******************************************************************************/

const specialsPredictionFromIndex = (index, specialsDna) => {
    if (index > -1) {
        return { mine: specialsDna.getMyClass(index), urs: specialsDna.getUrClass(index) };
    } else {
        return { mine: NORMAL, urs: NORMAL };
    }
};

const myDnaSpecialsPredictor = maxGeneLength => specialsDna => {
    const index = indexOfRecentGene(specialsDna.myStrand, maxGeneLength);
    return specialsPredictionFromIndex(index, specialsDna);
};

const urDnaSpecialsPredictor = maxGeneLength => specialsDna => {
    const index = indexOfRecentGene(specialsDna.urStrand, maxGeneLength);
    return specialsPredictionFromIndex(index, specialsDna);
};

const resultDnaSpecialsPredictor = maxGeneLength => specialsDna => {
    const index = indexOfRecentGene(specialsDna.resultStrand, maxGeneLength);
    return specialsPredictionFromIndex(index, specialsDna);
};

const mixedDnaSpecialsPredictor = maxGeneLength => specialsDna => {
    const index = indexOfRecentGene(specialsDna.mixedStrand, maxGeneLength);
    return specialsPredictionFromIndex(index, specialsDna);
};

const allSpecialsDnaPredictors = [myDnaSpecialsPredictor, urDnaSpecialsPredictor, resultDnaSpecialsPredictor, mixedDnaSpecialsPredictor]
    .map(dpf => [2, 3, 5, 8, 13].map(pl => dpf(pl)))
    .reduce((acc, curr) => acc.concat(curr), []);

/*****************************************************************************
* Draw DNA predictors                                                        *
******************************************************************************/

const drawPredictionFromIndex = (index, drawDna) => {
    if (index > -1) {
        return { mine: drawDna.getMyClass(index), urs: drawDna.getUrClass(index) };
    } else {
        return { mine: DYNAMITE, urs: NORMAL };
    }
};

const myDnaDrawPredictor = maxGeneLength => drawDna => {
    const index = indexOfRecentGene(drawDna.myStrand, maxGeneLength);
    return drawPredictionFromIndex(index, drawDna);
};

const urDnaDrawPredictor = maxGeneLength => drawDna => {
    const index = indexOfRecentGene(drawDna.urStrand, maxGeneLength);
    return drawPredictionFromIndex(index, drawDna);
};

const mixedDnaDrawPredictor = maxGeneLength => drawDna => {
    const index = indexOfRecentGene(drawDna.mixedStrand, maxGeneLength);
    return drawPredictionFromIndex(index, drawDna);
};

const baseDrawDnaPredictors = [myDnaDrawPredictor, urDnaDrawPredictor, mixedDnaDrawPredictor]
    .map(dpf => [2, 3, 5, 8, 13].map(pl => dpf(pl)))
    .reduce((acc, curr) => acc.concat(curr), []);

const drawDnaPredictorTransformers = [classRotator]
    .map(trans => [0, 1, 2].map(n => multipleTransformer(n)(trans)))
    .reduce((acc, curr) => acc.concat(curr), []);

const allDrawDnaPredictors = baseDrawDnaPredictors
    .map(dp => drawDnaPredictorTransformers.map(trans => trans(dp)))
    .reduce((acc, curr) => acc.concat(curr), []);

/*****************************************************************************
 * Scorers                                                                   *
 *****************************************************************************/

const averageCaseScorer = {
    getInitialScore: () => 0,
    getNextScore: (score, result) => score + result
};

const weightRecentScorer = {
    getInitialScore: () => 0,
    getNextScore: (score, result) => 0.85 * score + result
};

const consecutiveNonLossesScorer = {
    getInitialScore: () => 0,
    getNextScore: (score, result) => result < 0 ? result : score + result
};

const allScorers = [averageCaseScorer, weightRecentScorer, consecutiveNonLossesScorer];

/*****************************************************************************
 * Meta-scorers                                                              *
 *****************************************************************************/

const metaScorer = {
   getInitialScore: () => 0,
   getNextScore: (score, result) => 0.96 * score + result
};

/*****************************************************************************
 * Move DNA class definition                                                 *
 *****************************************************************************/

class MoveDna {

    constructor() {
        this.myStrand = '';
        this.urStrand = '';
        this.resultStrand = '';
        this.mixedStrand = '';
    }

    splice(myMove, urMove) {
        this.myStrand += myMove;
        this.urStrand += urMove;
        this.resultStrand += RESULT_NUCLEOTIDES[myMove][urMove];
        this.mixedStrand += MIXED_NUCLEOTIDES[myMove][urMove];
    }

    getMyMove(index) {
        return this.myStrand[index];
    }

    getUrMove(index) {
        return this.urStrand[index];
    }
}

/*****************************************************************************
* Specials DNA class definition                                              *
******************************************************************************/

class SpecialsDna {

    constructor() {
        this.myStrand = '';
        this.urStrand = '';
        this.resultStrand = '';
        this.mixedStrand = '';
    }

    splice(myMove, urMove) {
        this.myStrand += CLASS[myMove];
        this.urStrand += CLASS[urMove];
        this.resultStrand += RESULT_NUCLEOTIDES[myMove][urMove];
        this.mixedStrand += MIXED_CLASS_NUCLEOTIDES[myMove][urMove];
    }

    getMyClass(index) {
        return this.myStrand[index];
    }

    getUrClass(index) {
        return this.urStrand[index];
    }
}

/*****************************************************************************
* Draw DNA class definition                                                  *
******************************************************************************/

class DrawDna {

    constructor() {
        this.myStrand = '';
        this.urStrand = '';
        this.resultStrand = '';
        this.mixedStrand = '';
    }

    splice(myMove, urMove) {
        this.myStrand += CLASS[myMove];
        this.urStrand += CLASS[urMove];
        this.resultStrand += RESULT_NUCLEOTIDES[myMove][urMove];
        this.mixedStrand += MIXED_CLASS_NUCLEOTIDES[myMove][urMove];
    }

    getMyClass(index) {
        return this.myStrand[index];
    }

    getUrClass(index) {
        return this.urStrand[index];
    }
}

/*****************************************************************************
 * Predictor class definition                                                *
 *****************************************************************************/

class Predictor {

    constructor(dnaPredictor, scorer) {
        this.dnaPredictor = dnaPredictor;
        this.scorer = scorer;
        this.nextPrediction = undefined;
        this.score = scorer.getInitialScore();
    }

    getScore() {
        return this.score;
    }

    getNextPrediction() {
        return this.nextPrediction;
    }

    updateScore(resultDeterminer) {
        this.score = this.scorer.getNextScore(this.score, resultDeterminer(this.nextPrediction));
    }

    makeNextPrediction(dna) {
        this.nextPrediction = this.dnaPredictor(dna);
    }
}

/*****************************************************************************
 * Meta-predictor class definition                                           *
 *****************************************************************************/

class MetaPredictor {

    constructor(dnaPredictors, scorer, metaScorer) {
        this.predictors = dnaPredictors.map(dp => new Predictor(dp, scorer));
        this.metaScorer = metaScorer;
        this.nextPrediction = undefined;
        this.score = metaScorer.getInitialScore();
    }

    getScore() {
        return this.score;
    }

    getNextPrediction() {
        return this.nextPrediction;
    }

    updateScores(resultDeterminer) {
        this.predictors.forEach(p => p.updateScore(resultDeterminer));
        this.score = this.metaScorer.getNextScore(this.score, resultDeterminer(this.nextPrediction));
    }

    makePredictions(dna) {
        this.predictors.forEach(p =>  p.makeNextPrediction(dna));
        const bestPredictor = this.predictors[indexOfMax(this.predictors.map(p => p.getScore()))];
        this.nextPrediction = bestPredictor.getNextPrediction();
    }
}

/*****************************************************************************
 * Transcendent move predictor class definition                              *
 *****************************************************************************/

class TranscendentMovePredictor {

    constructor(scorers, metaScorer) {
        this.metaPredictorsOfUrMoves = scorers.map(s => new MetaPredictor(allMoveDnaPredictors.map(dp =>  extractUrs(dp)), s, metaScorer));
        this.metaPredictorsOfMyMoves = scorers.map(s => new MetaPredictor(allMoveDnaPredictors.map(dp => extractMine(dp)), s, metaScorer));
    }

    getNextPrediction() {
        const bestMetaPredictorOfUrMove  = this.metaPredictorsOfUrMoves[indexOfMax(this.metaPredictorsOfUrMoves.map(mp => mp.getScore()))];
        const bestMetaPredictorOfMyMove  = this.metaPredictorsOfMyMoves[indexOfMax(this.metaPredictorsOfMyMoves.map(mp => mp.getScore()))];

        if (bestMetaPredictorOfUrMove.getScore() >= bestMetaPredictorOfMyMove.getScore()) {
            return this.produceResult(bestMetaPredictorOfUrMove.getNextPrediction(), bestMetaPredictorOfUrMove.getScore());
        } else {
            return this.produceResult(aMoveThatBeats(bestMetaPredictorOfMyMove.getNextPrediction()), bestMetaPredictorOfMyMove.getScore());
        }
    }

    produceResult(urPredictedMove, certainty) {
        return {
            urPredictedMove: urPredictedMove,
            play: aMoveThatBeats(urPredictedMove),
            certainty: certainty
        };
    }

    updateScores(actualUrMove) {
        this.metaPredictorsOfUrMoves.forEach(mp => mp.updateScores(urMovePredictionResultDeterminer(actualUrMove)));
        this.metaPredictorsOfMyMoves.forEach(mp => mp.updateScores(myMovePredictionResultDeterminer(actualUrMove)));
    }

    makePredictions(dna) {
        this.metaPredictorsOfUrMoves.forEach(mp => mp.makePredictions(dna));
        this.metaPredictorsOfMyMoves.forEach(mp => mp.makePredictions(dna));
    }
}

/*****************************************************************************
* Transcendent specials predictor class definition                           *
******************************************************************************/

class TranscendentSpecialsPredictor {

    constructor(scorers, metaScorer) {
        this.metaPredictorsOfUrSpecials = scorers.map(s => new MetaPredictor(allSpecialsDnaPredictors.map(dp => extractUrs(dp)), s, metaScorer));
    }

    getNextPrediction() {
        const bestMetaPredictorOfUrSpecials = this.metaPredictorsOfUrSpecials[indexOfMax(this.metaPredictorsOfUrSpecials.map(mp => mp.getScore()))];
        return {
            urPredictedClass: bestMetaPredictorOfUrSpecials.getNextPrediction(),
            certainty: bestMetaPredictorOfUrSpecials.getScore()
        };
    }

    updateScores(actualUrMove) {
        this.metaPredictorsOfUrSpecials.forEach(mp => mp.updateScores(urSpecialsPredictionResultDeterminer(actualUrMove)));
    }

    makePredictions(dna) {
        this.metaPredictorsOfUrSpecials.forEach(mp => mp.makePredictions(dna));
    }
}

/*****************************************************************************
* Transcendent draw predictor class definition                               *
******************************************************************************/

class TranscendentDrawPredictor {

    constructor(scorers, metaScorer) {
        this.metaPredictorsOfUrClass = scorers.map(s => new MetaPredictor(allDrawDnaPredictors.map(dp =>  extractUrs(dp)), s, metaScorer));
        this.metaPredictorsOfMyClass = scorers.map(s => new MetaPredictor(allDrawDnaPredictors.map(dp => extractMine(dp)), s, metaScorer));
    }

    getNextPrediction() {
        const bestMetaPredictorOfUrClass  = this.metaPredictorsOfUrClass[indexOfMax(this.metaPredictorsOfUrClass.map(mp => mp.getScore()))];
        const bestMetaPredictorOfMyClass  = this.metaPredictorsOfMyClass[indexOfMax(this.metaPredictorsOfMyClass.map(mp => mp.getScore()))];

        if (bestMetaPredictorOfUrClass.getScore() >= bestMetaPredictorOfMyClass.getScore()) {
            return this.produceResult(bestMetaPredictorOfUrClass.getNextPrediction(), bestMetaPredictorOfUrClass.getScore());
        } else {
            return this.produceResult(classWinMapper(bestMetaPredictorOfMyClass.getNextPrediction()), bestMetaPredictorOfMyClass.getScore());
        }
    }

    produceResult(urPredictedClass, certainty) {
        return {
            urPredictedClass: urPredictedClass,
            play: classWinMapper(urPredictedClass),
            certainty: certainty
        };
    }

    updateScores(actualUrMove) {
        this.metaPredictorsOfUrClass.forEach(mp => mp.updateScores(urDrawPredictionResultDeterminer(actualUrMove)));
        this.metaPredictorsOfMyClass.forEach(mp => mp.updateScores(myDrawPredictionResultDeterminer(actualUrMove)));
    }

    makePredictions(dna) {
        this.metaPredictorsOfUrClass.forEach(mp => mp.makePredictions(dna));
        this.metaPredictorsOfMyClass.forEach(mp => mp.makePredictions(dna));
    }
}

/*****************************************************************************
* Game score-keeper class definition                                         *
******************************************************************************/

class GameScoreKeeper {

    constructor() {
        this.myScore = 0;
        this.urScore = 0;
        this.pointsForRound = 0;
    }

    update(myMove, urMove) {
        this.pointsForRound += 1;

        if (RESULTS[myMove][urMove] === 1) {
            this.myScore += this.pointsForRound;
            this.pointsForRound = 0;
        }

        if (RESULTS[urMove][myMove] === 1) {
            this.urScore += this.pointsForRound;
            this.pointsForRound = 0;
        }
    }

    getTotalScore() {
        return this.myScore + this.urScore;
    }

    getHighScore() {
        return this.myScore > this.urScore ? this.myScore : this.urScore;
    }
}

/*****************************************************************************
* Dynamite regulator class definition                                        *
******************************************************************************/

class DynamiteRegulator {

    constructor() {
        this.scoreKeeper = new GameScoreKeeper();
        this.dynamitesUsed = 0;
    }

    update(myMove, urMove) {
        this.scoreKeeper.update(myMove, urMove);
        if (myMove === DYNAMITE) { this.dynamitesUsed++; }
    }

    getEstimatedDynamitesRemaining() {
        const proportionDone = this.scoreKeeper.getHighScore() / WINNING_SCORE;
        return MAX_DYNAMITES - (this.dynamitesUsed / proportionDone);
    }

    getEstimatedDrawsRemaining() {
        const totalScore = this.scoreKeeper.getTotalScore();
        const highScore = this.scoreKeeper.getHighScore();
        return (totalScore * ((WINNING_SCORE / highScore) - 1)) / 3;
    }
}

/*****************************************************************************
* Panoptic predictor class definition                                        *
******************************************************************************/

class PanopticPredictor {

    constructor(scorers, metaScorer, numDrawPredictors) {
        this.consecutiveDraws = 0;
        this.dynamiteRegulator = new DynamiteRegulator();

        this.moveDna = new MoveDna();
        this.specialsDna = new SpecialsDna();
        this.drawDnas = Array(numDrawPredictors).fill().map(x => new DrawDna());

        this.transcendentMovePredictor = new TranscendentMovePredictor(scorers, metaScorer);
        this.transcendentSpecialsPredictor = new TranscendentSpecialsPredictor(scorers, metaScorer);
        this.transcendentDrawPredictors = Array(numDrawPredictors).fill().map(x => new TranscendentDrawPredictor(scorers, metaScorer));

        this.transcendentMovePredictor.makePredictions(this.moveDna);
        this.transcendentSpecialsPredictor.makePredictions(this.specialsDna);
        this.transcendentDrawPredictors.forEach((tdp, ix) => tdp.makePredictions(this.drawDnas[ix]));
    }

    update(myMove, urMove) {
        this.moveDna.splice(myMove, urMove);
        this.transcendentMovePredictor.updateScores(urMove);
        this.transcendentMovePredictor.makePredictions(this.moveDna);

        this.specialsDna.splice(myMove, urMove);
        this.transcendentSpecialsPredictor.updateScores(urMove);
        this.transcendentSpecialsPredictor.makePredictions(this.specialsDna);

        if (this.consecutiveDraws >= 2 && this.consecutiveDraws < 2 + this.drawDnas.length) {
            this.drawDnas[this.consecutiveDraws - 2].splice(myMove, urMove);
            this.transcendentDrawPredictors[this.consecutiveDraws - 2].updateScores(urMove);
            this.transcendentDrawPredictors[this.consecutiveDraws - 2].makePredictions(this.drawDnas[this.consecutiveDraws - 2]);
        }

        this.consecutiveDraws = (myMove === urMove) ? this.consecutiveDraws + 1 : 0;
        this.dynamiteRegulator.update(myMove, urMove);
    }

    getNextMove() {
        const movePredictorResult = this.transcendentMovePredictor.getNextPrediction();
        const specialsPredictorResult = this.transcendentSpecialsPredictor.getNextPrediction();

        const specialsPredictorWins = (specialsPredictorResult.urPredictedClass !== NORMAL) && (specialsPredictorResult.certainty > 2 * Math.max(0.5, movePredictorResult.certainty));

        const uWillPlayDynamite = (specialsPredictorWins ? specialsPredictorResult.urPredictedClass : movePredictorResult.urPredictedMove) === DYNAMITE;
        const uWillPlayWaterBalloon = (specialsPredictorWins ? specialsPredictorResult.urPredictedClass : movePredictorResult.urPredictedMove) === WATER_BALLOON;

        if (this.consecutiveDraws >= 2 && this.consecutiveDraws < 2 + this.transcendentDrawPredictors.length) {
            const drawPredictorResult = this.transcendentDrawPredictors[this.consecutiveDraws - 2].getNextPrediction();
            if (drawPredictorResult.certainty > 1.5 && drawPredictorResult.play === WATER_BALLOON) {
                return WATER_BALLOON;
            } else if (drawPredictorResult.play === DYNAMITE) {
                return DYNAMITE;
            } else {
                return randomRpsMove();
            }
        }

        if (this.consecutiveDraws == 1) {
            const estimatedDrawsRemaining = this.dynamiteRegulator.getEstimatedDrawsRemaining();
            const estimatedDynamitesRemaining = this.dynamiteRegulator.getEstimatedDynamitesRemaining();
            const proportionToExplode = estimatedDynamitesRemaining / estimatedDrawsRemaining;
            if (Math.random() < proportionToExplode && !uWillPlayWaterBalloon) {
                return DYNAMITE;
            }
        }

        if (this.consecutiveDraws >= 2) {
            return uWillPlayDynamite ? WATER_BALLOON : (uWillPlayWaterBalloon ? randomRpsMove() : DYNAMITE);
        }

        if (specialsPredictorWins) {
            return specialsPredictorResult.urPredictedClass === DYNAMITE ? WATER_BALLOON : randomRpsMove();
        }

        return movePredictorResult.play;
    }
}

/*****************************************************************************
 * The bot!                                                                  *
 *****************************************************************************/

shuffle(allMoveDnaPredictors);
shuffle(allSpecialsDnaPredictors);
shuffle(allDrawDnaPredictors);

class UnsightlyChimpanzee {

    constructor() {
        this.panopticPredictor = new PanopticPredictor(allScorers, metaScorer, 2);
        this.myDynamitesRemaining = MAX_DYNAMITES;
        this.urDynamitesRemaining = MAX_DYNAMITES;
    }

    applyDynamiteChecks(move) {
        if (this.urDynamitesRemaining === 0 && move === WATER_BALLOON) {
            return randomRpsMove();
        } else if (this.myDynamitesRemaining === 0 && move === DYNAMITE) {
            return randomRpsMove();
        } else {
            return move;
        }
    }

    makeMove(gamestate) {
        const roundNumber = gamestate.rounds.length;

        if (roundNumber > 0) {
            const lastRound = gamestate.rounds[roundNumber - 1];
            this.panopticPredictor.update(lastRound.p1, lastRound.p2);
            if (lastRound.p1 === DYNAMITE) { this.myDynamitesRemaining--; }
            if (lastRound.p2 === DYNAMITE) { this.urDynamitesRemaining--; }
        }

        const moveToPlay = this.panopticPredictor.getNextMove();
        return this.applyDynamiteChecks(moveToPlay);
    }
}

module.exports = new UnsightlyChimpanzee();