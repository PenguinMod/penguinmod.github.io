import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import appTarget from '../app-target';
import styles from './credits.css';
import { getInitialDarkMode } from '../../lib/tw-theme-hoc.jsx';

// import fosshostLogo from './fosshost-light.png';
import UserData from './users';

/* eslint-disable react/jsx-no-literals */

document.documentElement.lang = 'en';

const User = ({ image, text, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles.user}
    >
        <img
            className={styles.userImage}
            src={image}
            width="60"
            height="60"
        />
        <div className={styles.userInfo}>
            {text}
        </div>
    </a>
);
User.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    href: PropTypes.string
};

const UserList = ({ users }) => (
    <div className={styles.users}>
        {users.map((data, index) => (
            <User
                key={index}
                {...data}
            />
        ))}
    </div>
);
UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object)
};

const Credits = () => (
    <main className={styles.main}>
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                PenguinMod Credits
            </h1>
        </header>
        <section>
            <h1>All people below have either contributed to PenguinMod, TurboWarp, or another related project. They are not affiliated with GreenMod unless otherwise said.</h1>
        </section>
        <section>
            <h2>Thank you</h2>
            <p>
                Without TurboWarp, PenguinMod - and by extension, GreenMod - may have never existed.
                Thank you to everyone who worked on Scratch, TurboWarp and PenguinMod,
                you have made many people finally be able to make whatever they can imagine.
            </p>
            <a href="https://scratch.mit.edu/donate">
                Donate to support Scratch.
            </a>
            <br></br><br></br>
            <a href="https://github.com/sponsors/GarboMuffin">
                Donate to support TurboWarp.
            </a>
            <h2>Contributors</h2>
            <p>
                PenguinMod is made by a small bunch of developers.
                A list is below, but you can also check <a href="https://github.com/orgs/PenguinMod/people">our GitHub</a> incase this one is out of date.
            </p>
            <UserList users={UserData.pmDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <p>There are even community members who have helped develop PenguinMod. People like <i>you!</i></p>
            <UserList users={UserData.pmPullRequestDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <p>
                We've also included work from other open-source projects inside of PenguinMod.
                Here's a list of some other projects you should check out:
            </p>
            <UserList users={UserData.pmCodeUsedFrom} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <ul>
                <li>Code for "Center" option in Costume editor is from <a href="https://github.com/Nitro-Bolt/scratch-paint/blob/develop/src/containers/mode-tools.jsx#L203-L216">Cubester@Nitro-Bolt</a></li>
            </ul>
        </section>
        <section>
            <h2>GitHub Pages</h2>
            <p>We currently use <a href="https://pages.github.com/">GitHub Pages</a> to host GreenMod.</p>
            <a href="https://pages.github.com/">
                <img
                    src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/collections/github-pages-examples/github-pages-examples.png"
                    width="160"
                    height="160"
                />
            </a>
            <h2>Server Host</h2>
            <p>
                PenguinMod's Project Sharing server (also used by GreenMod) is currently hosted by <a href="https://github.com/ianyourgod">ianyourgod</a>.
                <br></br>
                <a href="https://github.com/ianyourgod">
                    <img src="https://avatars.githubusercontent.com/u/104151459?v=4" style={{ width: "128px" }}></img>
                </a>
            </p>
            <p>
                The PenguinMod Server API (also used by GreenMod) is maintained by many people.
                A list is below, but you can also check <a href="https://github.com/PenguinMod/PenguinMod-IntermediateBackendApi/graphs/contributors">the GitHub repository</a> incase this one is out of date.
            </p>
            <UserList users={UserData.pmApiDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <h2>Costumes</h2>
            <p>
                All PenguinMod costumes are downloaded or created from:
                <ul>
                    <li><a href="https://publicdomainvectors.org/">https://publicdomainvectors.org/</a></li>
                    <li><a href="https://discord.gg/NZ9MBMYTZh">User-submissions from the PenguinMod Discord Server</a></li>
                    <li>The PenguinMod Developers</li>
                </ul>
                All costumes exclusive to PenguinMod are included under Public Domain licenses or licenses such as MIT and CC0.
            </p>
            <p>This is the current list of user-submitted costume creators:</p>
            <UserList users={UserData.pmCostumeSubmittors} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <h2>Sound Effects</h2>
            <p>
                All PenguinMod sounds are downloaded or created from:
                <ul>
                    <li><a href="https://freesound.org/">https://freesound.org/</a></li>
                    <li><a href="https://archive.org/">https://archive.org/</a></li>
                    <li><a href="https://discord.gg/NZ9MBMYTZh">User-submissions from the PenguinMod Discord Server</a></li>
                    <li>The PenguinMod Developers</li>
                </ul>
                All sounds exclusive to PenguinMod are included under Public Domain licenses or licenses such as MIT and CC0.
            </p>
            <p>This is the current list of user-submitted sound creators:</p>
            <UserList users={UserData.pmSoundSubmittors} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <h2>Accounts</h2>
            <p>
                Scratch login on PenguinMod is managed with <a href="https://oauth2.scratch-wiki.info/">ScratchOAuth2</a>,
                see their <a href="https://github.com/ScratchVerifier/ScratchOAuth2">GitHub repository</a>.
                <br />
                <br />
                <i>
                    "ScratchOAuth2" is not actually affiliated with Scratch,
                    the Scratch Team, or the Scratch Foundation.
                </i>
            </p>
        </section>
        <section>
            <h1>PenguinMod & TurboWarp</h1>
        </section>
        <section>
            <h2>Extensions</h2>
            <p><i>
                If you are an extension developer who wants their extension removed from PenguinMod's extensions list,
                contact us as soon as you can. We'll get it removed as soon as we are able to.
            </i></p>
            <p>
                We use some MIT licensed extensions from TurboWarp as they are really useful!
                Check out the full list of TurboWarp extensions <a href="https://extensions.turbowarp.org/">here</a>,
                and see individual contributors below:
            </p>
            <UserList users={UserData.extensionDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <p>
                PenguinMod also has a few people who made and submitted extensions too!
                This list may get outdated sometimes, but here they are listed below:
            </p>
            <UserList users={UserData.pmExtensionDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <p>
                The Scratch Auth extension has a login system managed with <a href="https://auth.itinerary.eu.org/">Scratch Auth</a>,
                created by <a href="https://scratch.mit.edu/users/Looky1173/">Looky1173</a>.
                (thanks for adding us to the user list!)
                <br />
                <br />
                <i>
                    "Scratch Auth" is not actually affiliated with Scratch,
                    the Scratch Team, or the Scratch Foundation.
                </i>
            </p>
        </section>
        <section>
            <h2>Addons</h2>
            <p>
                Here are the developers that made the addons from <a href="https://scratchaddons.com/">Scratch Addons</a> available.
            </p>
            <UserList users={UserData.addonDevelopers} />
            <p><i>The list order is randomized on each refresh.</i></p>
            <p>PenguinMod-exclusive addons are created by the contributors listed in the Contributors section.</p>
        </section>
        <section>
            <h1>TurboWarp</h1>
        </section>
        <section>
            <p>
                The TurboWarp project is made possible by the work of many volunteers.
                <br></br>
                You can check out TurboWarp's individual credits <a href="https://turbowarp.org/credits.html">here</a>.
                <br></br>
                <a href="https://github.com/sponsors/GarboMuffin">
                    Donate to support TurboWarp.
                </a>
            </p>
        </section>
        {/* RIP Fosshost */}
        {/* <section>
            <h2>Fosshost</h2>
            <p>
                The TurboWarp project is proudly hosted by <a href="https://fosshost.org/">Fosshost</a> who provide free computing resources to the open source community.
            </p>
            <p>
                <a href="https://fosshost.org/donate">
                    Donate to support Fosshost.
                </a>
            </p>
            <a href="https://fosshost.org/">
                <img
                    src={fosshostLogo}
                    width="250"
                    height="125"
                />
            </a>
        </section> */}
        <section>
            <h2>Scratch</h2>
            <p>
                TurboWarp is based on the work of the <a href="https://scratch.mit.edu/credits">Scratch contributors</a> but is not endorsed by Scratch in any way.
            </p>
            <p>
                <a href="https://scratch.mit.edu/donate">
                    Donate to support Scratch.
                </a>
            </p>
        </section>
        <section>
            <h2>Translators</h2>
            <p>
                More than 100 people have helped translate TurboWarp and its addons into many languages —
                far more than we could hope to list here.
            </p>
            <p>
                PenguinMod is also (very very slowly) getting translated into other languages, in the future
                hopefully the same number of languages can be supported. It'll take a while until we get there though.
            </p>
            <p>Here is the current list of PenguinMod Translators:</p>
            <UserList users={UserData.pmTranslators} />
            <p><i>The list order is randomized on each refresh.</i></p>
        </section>
        <section>
            <p>
                <i>
                    Individual contributors are listed in no particular order.
                    The order is randomized each visit.
                </i>
            </p>
        </section>
    </main>
);

document.body.setAttribute('theme', getInitialDarkMode() ? 'dark' : 'light');

ReactDOM.render((
    <Credits />
), appTarget);
