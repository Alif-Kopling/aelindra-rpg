import { DialogueLine } from '../utils/types';

// ── PROLOGUE ──────────────────────────────────────────────────

export const PROLOGUE_NARRATION: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'In the kingdom of Aelindra, where candlelight never quite reached the castle\'s deepest halls...', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'There was a knight who loved his king more than he loved his own name.', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'His name was Alden.', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'And on the night when the stars refused to shine — everything he was, everything he had sworn to protect... was taken from him.', emotion: 'sad', isNarration: true },
];

// ── CHAPTER HEADERS ───────────────────────────────────────────

export const CHAPTER_1: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Chapter I — The Forsaken Knight', emotion: 'neutral', isNarration: true },
  { speaker: '— Narrator —', text: 'Betrayed by those he served. Hunted by those he once called brothers. Alden\'s only path forward is through the darkness.', emotion: 'determined', isNarration: true },
];

// ── VILLAGE ZONE ──────────────────────────────────────────────

export const VILLAGE_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'The village of Harrowmere clings to life at the edge of the kingdom — a place where hope goes to die slowly.', emotion: 'sad', isNarration: true },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'By the old gods... you actually made it. When I cut those chains, I wasn\'t sure you\'d survive the night.', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'You risked everything for me, Edric. I couldn\'t repay that by dying.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Hmph. Still stubborn. Good. But the village is crawling with risen dead. They come from the old graveyard every night now.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Valther\'s doing?', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Who else? The seals weakening — the dead don\'t stay dead. If you want to reach the castle, you\'ll have to clear a path.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then I\'ll start digging graves.', emotion: 'determined' },
];

export const VILLAGE_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*panting* ...They just keep coming.', emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'That\'s only the first wave. Something worse stirs beyond the church ruins.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'The corruption is spreading faster than I thought.', emotion: 'sad' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'You can\'t do this alone, boy. Let me help — properly this time.', emotion: 'determined' },
];

export const VILLAGE_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Mister Alden! You\'re okay!', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'Tam... you should be inside.', emotion: 'neutral' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'I brought you this. Mama said it belonged to her grandfather — a knight\'s charm. For protection.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '*takes the charm slowly* ...Thank you, Tam. I\'ll carry it with me.', emotion: 'sad' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'You\'re gonna stop the bad man, right? You\'re gonna make things right?', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'I swear it.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'The road to the forest is open now. But Alden... be careful. The Fogbound Forest has a tongue of its own — and it\'s been whispering.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I\'ve survived worse than whispers.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Have you? Go, then. And come back alive — or I\'ll drag you back myself.', emotion: 'happy' },
];

// ── FOREST ZONE ───────────────────────────────────────────────

export const FOREST_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'The Fogbound Forest breathes. A living thing of twisted roots and crawling mist. Some say the trees remember every sin committed beneath them.', emotion: 'sad', isNarration: true },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'You carry the weight of a dead king on your shoulders, young knight. I can feel it from here.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Who are you?', emotion: 'neutral' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'I am the voice the forest hasn\'t yet swallowed. I\'ve walked these paths for thirty years, and I\'ve seen what Valther\'s master is doing to this land.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther serves something?', emotion: 'shocked' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Beneath the castle. Older than the kingdom. A sealed darkness that whispers promises to those who listen. Valther listened... and the king had to die to break the first seal.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then I\'ll break Valther before he breaks any more seals.', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'The forest will test that resolve. Let us see if your conviction is sharper than your blade.', emotion: 'neutral' },
];

export const FOREST_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*breathing hard* ...These beasts... they\'re not natural. Their eyes...', emotion: 'sad' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'They were once forest guardians. The corruption twisted them into hollow shells. Just as Valther twisted the truth.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'How many seals are there?', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Four. The king\'s death broke the first. Each seal broken makes the ancient one stronger. If all four fall...', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'What happens if all four fall?', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'You don\'t want to know. But you will see it soon enough if you don\'t hurry.', emotion: 'sad' },
];

export const FOREST_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*collapses to one knee* ...There were... so many of them...', emotion: 'neutral' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'The forest is weeping. It doesn\'t want to fight you — it\'s being forced to.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then help me. You know more than you\'re telling me.', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'I have given you all I can. But take this — a censer blessed before the corruption began. Its light may part the shadows when all seems lost.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Thank you. I don\'t even know your name.', emotion: 'sad' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'Names are heavy things, knight. Carry your own a little longer. Now go — the castle awaits. And so does your truth.', emotion: 'determined' },
];

// ── CASTLE ZONE ───────────────────────────────────────────────

export const CASTLE_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Aelindra Castle. Once a beacon of hope and honor. Now a mausoleum of memories — and the truths buried within them.', emotion: 'sad', isNarration: true },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '...Alden?', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Your Highness. I... I know you have every right to strike me down where I stand.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*voice trembling* Do you know what it cost me to believe you capable of murder? Every night I dreamed of his face — and your hands covered in his blood.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I loved him too. He was like a father to me. I would never—', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'I know. I found his journal. Hidden in his private study — the one Valther said was "sealed for investigation."', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'The journal... it proves Valther\'s guilt?', emotion: 'shocked' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'It proves my father knew Valther was being consumed by something. And the night he died... he was going to confront him.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then Valther silenced him before he could.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'I accused you. I let them chain you. I let them drag you to the gallows... and you still came back.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I came back because my duty never ended. It just changed.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*wiping her eyes* The castle is crawling with Valther\'s risen guard. They answer to the Blind King — a guardian Valther corrupted to hold the second seal.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then I\'ll send him back to his grave.', emotion: 'determined' },
];

export const CASTLE_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*leaning against a broken pillar* ...These guards... they were once my brothers.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'They were. And now they\'re puppets. Valther doesn\'t care who he destroys — as long as the seals break.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'How deep does the corruption go?', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'To the very roots of the castle. There\'s a chamber beneath the throne room — a vault that hasn\'t been opened since my grandfather\'s time. That\'s where the second seal lies.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'And the Blind King guards it.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'He was once our family\'s most loyal protector. The corruption... it twisted his devotion into chains.', emotion: 'sad' },
];

export const CASTLE_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*gasping* The courtyard is clear... for now.', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Alden, listen to me. The Blind King — he couldn\'t be defeated by strength alone. My father\'s journal said he had a weakness. A name. His true name.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: 'His true name?', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Before he was the Blind King, he was Sir Galen — the knight who taught my father how to hold a sword. If you say his name... it might break the corruption\'s hold, just for a moment.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Galen... I\'ve heard stories about him. They called him the Knight of the Dawn.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Then remind him of the dawn. Before you strike him down... remind him who he was.', emotion: 'sad' },
];

export const CASTLE_BOSS_PRE: DialogueLine[] = [
  { speaker: 'Blind King', text: 'Who... dares... approach the sealed threshold?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sir Galen. It\'s me — Alden. The boy your king took in when I had nothing.', emotion: 'determined' },
  { speaker: 'Blind King', text: 'That name... No. That name died. I am nothing but hunger now.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'You were the Knight of the Dawn. You taught every royal guard who ever served this kingdom. And somewhere inside that corrupted shell — you still remember what honor feels like.', emotion: 'determined' },
  { speaker: 'Blind King', text: '*a terrible, guttural scream* LEAVE THIS PLACE OR BE CONSUMED!', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'I\'m sorry, Sir Galen. I\'ll end this.', emotion: 'sad' },
];

export const CASTLE_BOSS_POST: DialogueLine[] = [
  { speaker: 'Blind King', text: 'Alden... the boy who had nothing... now carries everything.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Sir Galen... you\'re free now.', emotion: 'sad' },
  { speaker: 'Blind King', text: 'Valther... descends to the catacombs. The third seal... must not fall. Do not let him... complete the ritual.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I won\'t.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*running in* Alden! You did it... you actually did it.', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'The catacombs. That\'s where Valther is heading. He\'s going for the third seal.', emotion: 'determined' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Then you\'re going after him.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I have to. Stay here — keep the castle secure. If I don\'t come back...', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Don\'t. Don\'t say it. You will come back. Because I\'m ordering you to — as your princess, and as the woman who owes you a debt she can never repay.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...I\'ll see you again, Evelyne. I promise.', emotion: 'determined' },
];

// ── CATACOMBS ZONE ────────────────────────────────────────────

export const CATACOMBS_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'The Sunken Catacombs. A labyrinth of bones and silence. Every step echoes like a heartbeat in the dark.', emotion: 'sad', isNarration: true },
  { speaker: 'Valther', portrait: 'valther', text: '*slow clapping* Bravo. Truly, bravo. You cut through my pawns like a hot blade through snow. I\'m almost impressed.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther. It ends here.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Ends? Oh, my dear foolish knight — it hasn\'t even begun. The king\'s death was merely the first note of a symphony. You think you\'re the hero of this story?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'I know what I am. I know what I\'m fighting for.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'You\'re fighting for a ghost. A kingdom that threw you away. A princess who condemned you. And yet you persist. It would be admirable if it weren\'t so pathetically blind.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Call me blind all you want. I still see clearer than you — because I\'m not the one serving a shadow.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: '*cold laugh* The catacombs will swallow your conviction. Let\'s see if you still believe in honor when you\'re buried in it.', emotion: 'angry' },
];

export const CATACOMBS_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*hand against the cold stone wall, breathing ragged* ...How deep do these tunnels go?', emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'The walls themselves seem to breathe. Faint whispers curl at the edge of hearing.', isNarration: true, emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I won\'t listen. I won\'t.', emotion: 'determined' },
  { speaker: '— Narrator —', text: 'But the whispers know his name. They\'ve been waiting for him.', isNarration: true, emotion: 'sad' },
];

export const CATACOMBS_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*falls to his knees* ...Every step... the darkness gets heavier...', emotion: 'sad' },
  { speaker: 'Valther', portrait: 'valther', text: '*echoing through the cavern* The third seal is nearly open, Alden. Can you feel it? The world trembling on the edge of something beautiful?', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'You\'re... insane.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'No. I\'m awake. The seal beneath the battlefield is the last one. Come and find me, little knight. If you dare.', emotion: 'angry' },
  { speaker: '— Narrator —', text: 'The ground trembles. Somewhere deep below, the third seal groans — and nearly breaks.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: '*pushing himself up* Not yet... it\'s not too late...', emotion: 'determined' },
];

// ── BATTLEFIELD ZONE ──────────────────────────────────────────

export const BATTLEFIELD_ENTRY: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'The Ruined Battlefields. Once a place of valor and sacrifice. Now a graveyard of hopes — and the stage for the final act.', emotion: 'sad', isNarration: true },
  { speaker: 'Valther', portrait: 'valther', text: 'Welcome to the end of your journey, Alden. I\'ll admit — I didn\'t think you\'d make it this far.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'Where is the seal, Valther?', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Everywhere. Under your feet. In the air you breathe. The final seal isn\'t a door — it\'s the battlefield itself. The blood of a thousand warriors feeds it.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'You\'ve slaughtered innocent people just to break a lock?', emotion: 'angry' },
  { speaker: 'Valther', portrait: 'valther', text: 'Innocent? There are no innocents. There are only those who serve the light — and those brave enough to embrace the dark.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'You don\'t embrace the dark. You drown in it. And I\'m going to pull you out — or cut you down.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: '*grins* Then come. Let\'s end this dance properly.', emotion: 'angry' },
];

export const BATTLEFIELD_ROUND1_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*drenched in sweat and blood* ...How many more?', emotion: 'neutral' },
  { speaker: 'Valther', portrait: 'valther', text: 'As many as it takes. The seal FEEDS on conflict, Alden. Every sword swing, every drop of blood spilled — it brings me closer to awakening.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then I\'ll end this fast.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'You still don\'t understand. You were never going to stop me. You were always just the final ingredient.', emotion: 'angry' },
];

export const BATTLEFIELD_ROUND2_POST: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: '*struggling to stand, sword trembling* I\'m... still standing... Valther.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'Yes. You are. And that\'s precisely what I needed.', emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'The sky tears open. A pillar of darkness erupts from the battlefield\'s heart. And Valther begins to change.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'The ancient one has waited centuries for a vessel worthy of its power. Did you think I would let it consume ME? No, Alden. I will consume IT.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'You\'ve lost your mind.', emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'I\'ve lost nothing. I\'ve gained EVERYTHING. Behold — your god\'s failure made manifest!', emotion: 'angry' },
];

export const BATTLEFIELD_BOSS_PRE: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'The Ashen Knight rises. Valther\'s form now a twisted colossus of shadow and molten rage — the ancient one half-born through his flesh.', emotion: 'shocked', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'Valther! You\'re still in there! Fight it!', emotion: 'determined' },
  { speaker: 'Ashen Knight', text: '*voice layered with something ancient and terrible* Valther... is... GONE. There is only the hunger now.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'No. I\'ve lost too much to lose to a shadow wearing a dead man\'s face.', emotion: 'determined' },
  { speaker: 'Ashen Knight', text: 'You have already lost, little knight. You lost the moment you loved a kingdom that would never love you back.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Maybe. But I didn\'t fight for the kingdom. I fought for the people IN it.', emotion: 'determined' },
  { speaker: '— Narrator —', text: 'Alden raises his blade one final time. The weight of every fallen friend, every broken vow, every scar — channeled into a single moment.', emotion: 'determined', isNarration: true },
  { speaker: 'Alden', portrait: 'alden', text: 'For Aelindra. For everyone I couldn\'t save. I WILL END THIS.', emotion: 'determined' },
];

export const BATTLEFIELD_BOSS_POST: DialogueLine[] = [
  { speaker: 'Ashen Knight', text: '*crumbling* Impossible... the ancient one promised... eternity...', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'It lied.', emotion: 'determined' },
  { speaker: 'Ashen Knight', text: 'You... foolish... boy... you\'ve only... delayed the inevitable... the darkness... always... returns...', emotion: 'angry' },
  { speaker: '— Narrator —', text: 'The Ashen Knight collapses into ash. The pillar of darkness shatters. And for the first time in months — the sun touches the battlefield.', isNarration: true, emotion: 'neutral' },
];

// ── ENDING ────────────────────────────────────────────────────

export const ENDING_SCENE: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'The darkness was sealed. The ancient one — silenced at last.', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'But the wounds Alden carried... were too deep. Even for a knight who had survived everything.', isNarration: true, emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*kneeling beside him, hands pressed against his wound* Alden. Alden, stay with me. Please. The healers are coming—', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...It\'s alright. I\'m... I\'m not cold. That\'s strange.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '*tears falling* Don\'t you dare make peace with this. Fight it.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Evelyne. The kingdom is yours now. And you\'ll be... you\'ll be magnificent. I always knew it.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...Tell Tam I said the hero he believed in... was real.', emotion: 'sad' },
  { speaker: '— Narrator —', text: 'The kingdom finally learned the truth. And wept for the knight they had abandoned.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narrator —', text: 'Years later, a great statue was raised in the capital — with flowers always at its feet.', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'And on the pedestal, carved in letters of gold, the words the princess herself chose:', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: '"Here lies Alden — the knight the world hated... who saved everyone."', isNarration: true, emotion: 'neutral' },
  { speaker: '— Narrator —', text: 'And somewhere beyond the sunlight, beyond the reach of shadow... a king and his most loyal knight walk together again.', isNarration: true, emotion: 'loving' },
];

// ── NPC SIDE DIALOGUES (optional, still available) ────────────

export const BLACKSMITH_DIALOGUE: DialogueLine[] = [
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'You\'re still alive, you stubborn fool. Good. Sit. Let me look at that wound.', emotion: 'happy' },
  { speaker: 'Alden', portrait: 'alden', text: 'I can\'t stay long, Edric. They\'ll come looking.', emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Let them come. I\'ve got thirty years of hammer-swinging in these arms. Here — I\'ve been working on something for you.', emotion: 'determined' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'The Forsaken Blade. Not fit for a king\'s court. But perfect for a knight who fights for truth in the dark.', emotion: 'determined' },
];

export const VILLAGE_BOY_DIALOGUE: DialogueLine[] = [
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'Mister knight! Are you really Alden? The one they say killed the king?', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: '...You should run from me, boy. Everyone else does.', emotion: 'sad' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'But you saved my mama from the monsters last night. Evil men don\'t do that.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...', emotion: 'sad' },
  { speaker: 'Tam (Village Boy)', portrait: 'boy', text: 'I believe you, sir. I\'ll always believe you.', emotion: 'happy' },
];

export const NUN_DIALOGUE: DialogueLine[] = [
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'You\'ve come far, child. Farther than most would have dared.', emotion: 'neutral' },
  { speaker: 'Alden', portrait: 'alden', text: 'The road ahead is still long.', emotion: 'determined' },
  { speaker: 'Wandering Nun', portrait: 'nun', text: 'All roads end somewhere. Make sure yours ends with you standing — not kneeling.', emotion: 'determined' },
];

export const EVELYNE_TURNING_POINT: DialogueLine[] = [
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'I found my father\'s journal. He wrote... he wrote that Valther had been asking strange questions about the seals.', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Your Highness—', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Don\'t. Not yet. I need to say this. I was... I was wrong about you.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: '...You had every reason to believe what you believed.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'I had every reason to ask the right questions first. I didn\'t. I\'m sorry, Alden.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'You don\'t have to apologize to me.', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Yes. I do.', emotion: 'determined' },
];

// ── OLD DIALOGUES (kept for backward compat but not used in rounds) ──

export const CASTLE_DIALOGUE_INTRO: DialogueLine[] = [
  { speaker: 'Alden', portrait: 'alden', text: 'Your Majesty... the eastern patrols reported strange lights near the ancient seals. I ask permission to investigate.', emotion: 'determined' },
  { speaker: 'King Aldric', portrait: 'king', text: 'Alden... my most trusted blade. I fear something stirs in the old dark. But tonight — stay close. I am uneasy.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'I will guard you with my life, Sire.', emotion: 'determined' },
  { speaker: 'King Aldric', portrait: 'king', text: '...You always have, my boy. That is why I trust you above all others.', emotion: 'sad' },
];

export const BETRAYAL_SCENE: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'Three hours later. A scream tears through the castle walls.', isNarration: true, emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'SEIZE HIM! The knight Alden has murdered our king! I witnessed it myself!', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'What— No! I found him like this! Valther, you KNOW I would never—', emotion: 'shocked' },
  { speaker: 'Valther', portrait: 'valther', text: 'The blade is in your hand, traitor. There is nothing more to say.', emotion: 'neutral' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: '...You... You killed him. You killed my father.', emotion: 'sad' },
  { speaker: 'Alden', portrait: 'alden', text: 'Your Highness, please— I swear on everything I am—', emotion: 'sad' },
  { speaker: 'Princess Evelyne', portrait: 'evelyne', text: 'Take him away. I cannot look at him.', emotion: 'angry' },
];

export const ESCAPE_NARRATION: DialogueLine[] = [
  { speaker: '— Narrator —', text: 'They dragged him to the execution yard at dawn.', isNarration: true, emotion: 'sad' },
  { speaker: '— Narrator —', text: 'But the old blacksmith, Edric — the one man who still believed — cut his chains in the dark before the bell tolled.', isNarration: true, emotion: 'neutral' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'You didn\'t do it. I know it in these old bones. Now RUN, boy. Run and find the truth.', emotion: 'determined' },
  { speaker: 'Alden', portrait: 'alden', text: '...Edric...', emotion: 'sad' },
  { speaker: 'Old Edric', portrait: 'blacksmith', text: 'Don\'t you dare cry. Not yet. Survive first. Then grieve.', emotion: 'determined' },
];

export const FINAL_BATTLE_DIALOGUE: DialogueLine[] = [
  { speaker: 'Valther', portrait: 'valther', text: 'Still alive? Still clinging to that foolish notion of honor? You are a relic of a dead world, Alden.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Maybe. But this relic is going to end you.', emotion: 'determined' },
  { speaker: 'Valther', portrait: 'valther', text: 'The darkness beneath this kingdom is ETERNAL. Even if you kill me, it will find another vessel.', emotion: 'angry' },
  { speaker: 'Alden', portrait: 'alden', text: 'Then I\'ll seal it with my last breath if I have to.', emotion: 'determined' },
];

export const QUEST_INTRO_VILLAGE: DialogueLine[] = [
  { speaker: 'Frightened Villager', text: 'The undead have been raiding our farms at night! Please, we have nowhere to go!', emotion: 'shocked' },
  { speaker: 'Alden', portrait: 'alden', text: 'Stay inside after dark. I\'ll handle this.', emotion: 'determined' },
];
