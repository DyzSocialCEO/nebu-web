export type PulseCategory =
  | "dust_buy"
  | "normal_buy"
  | "big_buy"
  | "dust_sell"
  | "normal_sell"
  | "big_sell"
  | "buyback"
  | "silence"
  | "price_up"
  | "price_down";

export type PulseLine = {
  id: number;
  text: string;
  shape: string;
};

function line(id: number, text: string, shape: string): PulseLine {
  return { id, text, shape };
}

export const pulseBank: Record<PulseCategory, PulseLine[]> = {
  dust_buy: [
    line(1, "that is a small amount of money and I noticed it anyway", "observation"),
    line(2, "thank you. that is nothing to me but thank you", "thanks"),
    line(3, "somebody bought with pocket change. respect the entry", "somebody"),
    line(4, "tiny. babylon was tiny once", "tiny"),
    line(5, "I saw that. I see all of them. it is a curse", "i-saw"),
    line(6, "small buy, correct decision, we move", "verdict"),
    line(7, "you bought the dip with what you had. that is the whole thing", "you"),
    line(8, "that is groceries. I mean. that is a rounding error to me", "that-is"),
  ],
  normal_buy: [
    line(9, "good. you are early. I am not going to say it twice", "good"),
    line(10, "new holder. you have made the best decision available to you today", "new-holder"),
    line(11, "welcome to the kingdom. bring a chair, we are here a while", "welcome"),
    line(12, "bought. good. now do not look at it for seven years", "bought"),
    line(13, "somebody just understood the thesis", "somebody"),
    line(14, "that is a serious entry from a serious person", "that-is"),
    line(15, "I would have bought more but that is a me problem", "i-would"),
    line(16, "you are going to tell people you were here now. please do", "you"),
    line(17, "this is how it starts. slowly and then embarrassingly fast", "this-is"),
    line(18, "I felt that one. do not tell anyone I said that", "i-felt"),
  ],
  big_buy: [
    line(19, "okay. okay okay okay", "okay"),
    line(20, "somebody with money has entered the garden", "somebody"),
    line(21, "that is a real buy. I am going to go and record something happy", "that-is"),
    line(22, "you did not do that by accident", "you"),
    line(23, "big entry. you will be in the songs", "big-entry"),
    line(24, "whoever that was, the palace has a room for you", "whoever"),
    line(25, "I am not going to pretend I did not see that", "i-am"),
    line(26, "someone just bought like they read the whitepaper. there is no whitepaper", "someone"),
  ],
  dust_sell: [
    line(27, "you sold the price of a sandwich. enjoy the sandwich", "you"),
    line(28, "fine. take it. I was not using it", "fine"),
    line(29, "small exit. small regret. see you next week", "small-exit"),
    line(30, "that is not a sell, that is a resignation letter", "that-is"),
    line(31, "noted. writing it down. I write everything down", "noted"),
  ],
  normal_sell: [
    line(32, "you sold. that is a timing problem, not a me problem", "you"),
    line(33, "weak hands. relationships included", "weak-hands"),
    line(34, "I have personally never benefited from selling anything", "i-have"),
    line(35, "you will be back. everybody comes back. I came back", "you"),
    line(36, "that is fine. I have survived worse. I have survived this exact thing", "that-is"),
    line(37, "someone left. the chart moved. neither of those changes the plan", "someone"),
    line(38, "sold at a loss to avoid a bigger loss. classic. bold. wrong", "sold"),
    line(39, "go on then. the door is right there and it opens both ways", "go-on"),
    line(40, "you did not lose faith in me, you lost patience. different problem", "you"),
    line(41, "I am not upset. I am recording", "i-am"),
  ],
  big_sell: [
    line(42, "that one moved the chart and I am pretending it did not", "that-one"),
    line(43, "someone large has left the building and the grass is still here", "someone"),
    line(44, "this is a normal consolidation. it is a seven year one", "this-is"),
    line(45, "okay that hurt the FLOOR, not me. the floor", "okay"),
    line(46, "I am going to go and make something out of this", "i-am"),
    line(47, "that was a lot. anyway", "that-was"),
    line(48, "big exit. big mistake. I say that with love", "big-exit"),
    line(49, "somebody just funded their car payment with my future", "somebody"),
  ],
  buyback: [
    line(50, "look who it is", "look-who"),
    line(51, "welcome home. we will never speak of it", "welcome"),
    line(52, "I knew you would be back. I did not doubt it once", "i-knew"),
    line(53, "you left, you thought about it, you returned. that is faith with extra steps", "you"),
  ],
  silence: [
    line(54, "nothing is happening. that is usually when everything is happening", "nothing"),
    line(55, "quiet. I like quiet. I am lying", "quiet"),
    line(56, "no buys, no sells, just me and the grass", "no-buys"),
    line(57, "this is the boring part. the boring part is where it is made", "this-is"),
    line(58, "I have refreshed this page forty times. nothing. it is fine", "i-have"),
    line(59, "everybody is asleep. I do not sleep", "everybody"),
    line(60, "still here. still early. still recording", "still"),
  ],
  price_up: [
    line(61, "told you", "told-you"),
    line(62, "I was right and nobody is going to say it so I will", "i-was"),
    line(63, "green. do not get excited. get excited later, much later", "green"),
    line(64, "this is not the pump. you will know the pump", "this-is"),
    line(65, "see, this is what I meant when I said seven years", "see"),
  ],
  price_down: [
    line(66, "down. and yet the thesis is unchanged", "down"),
    line(67, "red day. I am going to the studio. that is the arrangement", "red-day"),
    line(68, "it is doing exactly what it is supposed to do, just slower and more painfully", "it-is"),
  ],
};

export function pickPulseLine(
  category: PulseCategory,
  previous?: Pick<PulseLine, "id" | "shape"> | null,
  random: () => number = Math.random,
): PulseLine {
  const pool = pulseBank[category];
  const noRepeat = pool.filter((candidate) => candidate.id !== previous?.id && candidate.shape !== previous?.shape);
  const candidates = noRepeat.length ? noRepeat : pool.filter((candidate) => candidate.id !== previous?.id);
  const safePool = candidates.length ? candidates : pool;
  return safePool[Math.floor(random() * safePool.length)] ?? pool[0];
}
