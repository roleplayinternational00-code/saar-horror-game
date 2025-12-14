/**
 * Story Manager for Saar Horror Game
 * Die Flüsternde (The Whispering One) - A creepypasta narrative along the Saar River
 */

class StoryManager {
    constructor() {
        this.currentChapter = 0;
        this.documentsFound = [];
        this.objectives = [];
        this.initializeStory();
    }

    initializeStory() {
        this.chapters = [
            {
                id: 0,
                name: "The Beginning",
                location: "Saarbrücken Riverside",
                objective: "Find the first document",
                unlocked: true
            },
            {
                id: 1,
                name: "The First Whispers",
                location: "Old Mill Ruins",
                objective: "Investigate the abandoned mill",
                unlocked: false
            },
            {
                id: 2,
                name: "The Historian's Warning",
                location: "Saarlouis Archives",
                objective: "Discover the historical connection",
                unlocked: false
            },
            {
                id: 3,
                name: "The Drowning Village",
                location: "Submerged Hamlet",
                objective: "Explore the flooded ruins",
                unlocked: false
            },
            {
                id: 4,
                name: "The Ritual Site",
                location: "Forest Clearing",
                objective: "Find evidence of ancient ceremonies",
                unlocked: false
            },
            {
                id: 5,
                name: "The Whispering Depths",
                location: "Underground Caverns",
                objective: "Descend into the river caves",
                unlocked: false
            },
            {
                id: 6,
                name: "The Truth Revealed",
                location: "Hidden Chamber",
                objective: "Uncover the final secret",
                unlocked: false
            },
            {
                id: 7,
                name: "The Choice",
                location: "River's Edge",
                objective: "Make your final decision",
                unlocked: false
            }
        ];

        // 8 Documents that tell the story of Die Flüsternde
        this.documents = [
            {
                id: 1,
                title: "Journal Entry - Karl Weber, 1923",
                chapter: 0,
                found: false,
                content: `July 15th, 1923

I've lived by the Saar my entire life, and never have I heard such sounds. 
At night, when the mist rises from the water, there's a voice. Not quite 
singing, not quite speaking. The old ones call it 'Die Flüsternde' - The 
Whispering One.

My grandfather told me stories, but I thought them folklore. Now I'm not 
so sure. The voice calls names. Last night, it called mine.

I found scratches on my bedroom window this morning. From the outside. 
I'm on the third floor.

- K.W.`
            },
            {
                id: 2,
                title: "Police Report - Missing Persons, 1924",
                chapter: 1,
                found: false,
                content: `SAARBRÜCKEN POLIZEI - CONFIDENTIAL

Date: March 3rd, 1924
Case #: 1924-087

Subject: Multiple disappearances along Saar River

Seven individuals reported missing in past six months. All last seen 
near the riverbank at night. No bodies recovered. Witnesses report 
hearing 'unusual sounds' from the water before disappearances.

Local folklore mentions 'Die Flüsternde' - entity said to lure people 
to the river. Investigating rational explanations, but patterns are 
disturbing.

Note: Found journal belonging to Karl Weber (see attached). Last entry 
dated three days before his disappearance.

Detective Mueller`
            },
            {
                id: 3,
                title: "Historical Records - Monastery Archive, 1687",
                chapter: 2,
                found: false,
                content: `From the records of Brother Johannes, Scribe of St. Arnual

In this year of our Lord 1687, I must record a most troubling event. 
The river has claimed another soul. Young Wilhelm, the miller's son, 
walked into the Saar at midnight, witnesses say he was "following a voice."

The elders speak of an old curse. Before Christianity came to these 
lands, the river tribes worshipped a water spirit. They made offerings 
to appease it. When the old ways were forbidden, the entity grew angry.

Every generation, it takes its tribute. The whispers begin again, and 
someone always answers. We pray for deliverance, but the Saar keeps 
its secrets deep.

The voice in the water never stops calling.`
            },
            {
                id: 4,
                title: "Letter - Anna Schmidt to her sister, 1956",
                chapter: 3,
                found: false,
                content: `Dearest Helena,

I'm writing to warn you - do not come to visit as planned. Something 
is very wrong in Saarlouis.

You remember the old village that was flooded when they built the dam? 
They say during droughts, you can still see the church steeple. Well, 
the water is low this year. Very low.

Peter went down to look at the ruins last week. He came back changed. 
Won't speak, just sits by the window staring at the river. At night, 
he whispers in a language I don't recognize.

I hear it too now. A voice in the water, speaking words that pull at 
something deep inside. The drowned village wants us to remember. 
Die Flüsternde wants us to come home.

Please, don't come. Forget you have a sister in Saarland.

- Anna

P.S. If you don't hear from me again, tell Mother I'm sorry.`
            },
            {
                id: 5,
                title: "Research Notes - Dr. Hoffman, Folklorist, 1978",
                chapter: 4,
                found: false,
                content: `FIELD RESEARCH - SAAR RIVER MYTHOLOGY

After three years of study, I've mapped nineteen sites along the Saar 
where disappearances cluster. Each site corresponds to pre-Christian 
ritual locations.

The entity known as 'Die Flüsternde' appears in records dating back to 
Roman occupation. Always the same pattern:
- Whispers heard from the water
- Victims compelled to approach
- Disappearance during fog or mist
- No bodies recovered

Most intriguing: survivors (rare) describe hearing their name spoken 
in their own voice, but "older somehow, like it's been calling for 
centuries."

Found carved stones in forest clearing near Saarbrücken. Ancient 
Germanic runes. Rough translation: "She who dwells below must be fed, 
lest she drink the river dry and walk among us."

I believe this entity is real. Not supernatural, but something we don't 
yet understand. Tomorrow I investigate the cave system beneath the old 
mill. If I'm right, answers lie below.

UPDATE: Strange whispers on my recordings. They sound like... me?`
            },
            {
                id: 6,
                title: "Cave Expedition Log - Dr. Hoffman, 1978",
                chapter: 5,
                found: false,
                content: `October 31st, 1978 - 2:00 AM

I should never have come down here alone. The cave system is vast, much 
larger than geological surveys indicated. The river flows through chambers 
that feel... constructed. Walls too smooth. Angles too precise.

The whispers are louder here. They echo from deeper passages. I've been 
following them for hours.

3:45 AM - Found something. A chamber filled with offerings. Coins, jewelry, 
clothes spanning centuries. And bones. So many bones arranged in patterns.

The whispers say my name now. They say everyone's name. All at once. 
Hundreds of voices, thousands, speaking in unison.

4:30 AM - There's something in the water. Not human. Not animal. It 
moves like liquid shadow, and when it whispers, the sound comes from 
inside my skull.

It's not malevolent. It's lonely. It's been alone in the dark for so 
long, calling out, hoping someone will stay.

I understand now why people walk into the river. It promises we'll never 
be alone again. We'll become part of the chorus. Part of Die Flüsternde.

The water is so inviting. I think I'll rest here awhile.

[Final entry - Dr. Hoffman's body was never recovered]`
            },
            {
                id: 7,
                title: "Modern Investigation - Detective Sarah Klein, 2019",
                chapter: 6,
                found: false,
                content: `CASE FILE UPDATE - Cold Cases Review Unit

I've been assigned to review the Saar River disappearances. Forty-three 
unsolved cases spanning 1920-2018. The patterns are undeniable.

Found Dr. Hoffman's original research in archives. His notes about the 
cave system checked out - I sent a team down. They found the chamber he 
described. The offerings. The bones.

Forensics dated some remains to medieval period. Others much older. 
Some... they can't date. "Anomalous composition" according to the lab.

We sealed the caves. Posted warnings. But people still hear it. Three 
new disappearances this year alone. All described hearing whispers 
before they vanished.

I've started hearing it too. My own voice, calling from the river. 
It knows things about me. Private things. Memories I've never shared.

How does it know my childhood nickname? The lullaby my mother sang?

Last night I woke up at the window, ready to climb out. Found mud on 
my feet this morning. River mud.

I'm requesting immediate transfer. Someone else needs to handle this. 
Someone it hasn't started calling yet.`
            },
            {
                id: 8,
                title: "Your Note - Found in Your Pocket",
                chapter: 7,
                found: false,
                content: `This is in your handwriting, but you don't remember writing it:

"You came looking for answers. Now you know the truth. Die Flüsternde 
is not a monster or a curse. It's a collector of voices, of stories, 
of souls who walked beside the Saar.

Every person who ever disappeared is still here, in the water, in the 
whispers. They're not dead. They're not alive. They're eternal.

The river remembers everything. Everyone. And now it knows you.

You have a choice:
- Leave now. Run far from the Saar. But you'll always hear the whispers. 
  Always. Distance doesn't matter. It knows your voice now.
  
- Or walk into the water. Join the chorus. Never be lonely. Never be 
  forgotten. Become part of something ancient and vast.

The Saar is patient. It's been here for thousands of years. It will 
wait for your answer.

But it's already inside your head, isn't it? 

You can hear us whispering.

Come home."

[The handwriting becomes shaky at the end, and there are water stains 
on the paper that smell of the river]`
            }
        ];
    }

    // Find a document and unlock related chapter
    findDocument(documentId) {
        const doc = this.documents.find(d => d.id === documentId);
        if (doc && !doc.found) {
            doc.found = true;
            this.documentsFound.push(documentId);
            
            // Unlock next chapter
            if (doc.chapter < this.chapters.length - 1) {
                this.chapters[doc.chapter + 1].unlocked = true;
            }
            
            this.updateObjectives();
            return doc;
        }
        return null;
    }

    // Get current chapter information
    getCurrentChapter() {
        return this.chapters[this.currentChapter];
    }

    // Progress to next chapter
    progressChapter() {
        if (this.currentChapter < this.chapters.length - 1) {
            const nextChapter = this.currentChapter + 1;
            if (this.chapters[nextChapter].unlocked) {
                this.currentChapter = nextChapter;
                this.updateObjectives();
                return this.chapters[this.currentChapter];
            }
        }
        return null;
    }

    // Update current objectives
    updateObjectives() {
        const chapter = this.getCurrentChapter();
        this.objectives = [
            chapter.objective,
            `Documents found: ${this.documentsFound.length}/8`,
            `Current location: ${chapter.location}`
        ];
    }

    // Get all found documents
    getFoundDocuments() {
        return this.documents.filter(doc => doc.found);
    }

    // Get current objectives
    getObjectives() {
        return this.objectives;
    }

    // Check if story is complete
    isStoryComplete() {
        return this.documentsFound.length === 8 && this.currentChapter === 7;
    }

    // Get story completion percentage
    getCompletionPercentage() {
        return Math.round((this.documentsFound.length / 8) * 100);
    }

    // Get hint for current chapter
    getChapterHint() {
        const hints = [
            "Search near the riverside benches. Someone left something behind.",
            "The old mill by the water holds secrets in its ruins.",
            "The archives in Saarlouis contain historical records of strange events.",
            "When the water is low, the past resurfaces. Look for the drowned village.",
            "Deep in the forest, ancient stones mark where rituals once occurred.",
            "Below the earth, where the river runs through darkness, truth awaits.",
            "All evidence points to one location. Follow the whispers.",
            "The final choice is yours alone. The river is waiting."
        ];
        return hints[this.currentChapter] || "Explore the area carefully.";
    }

    // Easter egg: Get the entity's perspective
    getWhisperMessage() {
        const whispers = [
            "I know your name...",
            "The river remembers all who walk beside it...",
            "So many voices... won't you join us?",
            "Loneliness is the deepest water...",
            "Come closer... just listen...",
            "We are many, we are one, we are Die Flüsternde...",
            "The Saar flows forever, and so shall you..."
        ];
        return whispers[Math.floor(Math.random() * whispers.length)];
    }

    // Save game state
    saveState() {
        const state = {
            currentChapter: this.currentChapter,
            documentsFound: this.documentsFound,
            unlockedChapters: this.chapters.map(c => c.unlocked),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('saarHorrorGameState', JSON.stringify(state));
        return state;
    }

    // Load game state
    loadState() {
        const saved = localStorage.getItem('saarHorrorGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.currentChapter = state.currentChapter;
            this.documentsFound = state.documentsFound;
            state.unlockedChapters.forEach((unlocked, index) => {
                this.chapters[index].unlocked = unlocked;
            });
            this.documentsFound.forEach(docId => {
                const doc = this.documents.find(d => d.id === docId);
                if (doc) doc.found = true;
            });
            this.updateObjectives();
            return true;
        }
        return false;
    }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryManager;
}
