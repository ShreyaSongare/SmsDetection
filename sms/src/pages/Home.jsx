// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <motion.div
//       className="page"
//       initial={{ opacity: 0, y: -30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8 }}
//     >
//       <h1>📩 SMS Detection System</h1>

//       <p style={{ maxWidth: "700px", margin: "20px auto", lineHeight: "1.6" }}>
//         Our SMS Detection System helps users identify whether a message is
//         <strong> Spam</strong>, <strong>Harmful</strong>, or <strong>Safe</strong>.
//         With the increasing number of fraud messages, phishing attacks, and
//         threatening content, it has become very important to verify SMS before
//         trusting them.
//       </p>

//       <p style={{ maxWidth: "700px", margin: "20px auto", lineHeight: "1.6" }}>
//         This application allows you to paste any SMS and instantly detect its
//         category. Detected messages are automatically stored in Spam or Safe
//         sections for better tracking and security awareness.
//       </p>

//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: 1 }}
//         transition={{ delay: 0.5, type: "spring" }}
//       >
//         <Link to="/login">
//           <button style={{ marginRight: "10px" }}>Get Started</button>
//         </Link>

//         <Link to="/signup">
//           <button>Create Account</button>
//         </Link>
//       </motion.div>
//     </motion.div>
//   );
// }
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* LEFT SIDE */}
      <motion.div
        className="home-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>📩 SPAMURAI: SMS Detection System</h2>

        <p>
          Our SMS Detection System helps users identify whether a message is
          <strong> Spam</strong>, <strong> Harmful</strong>, or <strong> Safe</strong>.
          With increasing fraud messages and phishing attacks, it is important
          to verify SMS before trusting them.
        </p>

        <p>
          Paste any SMS and instantly detect its category. Detected messages
          are automatically stored for better tracking and security awareness.
        </p>

        <div className="home-buttons">
          <Link to="/login">
            <button className="primary-btn">Get Started</button>
          </Link>

          <Link to="/signup">
            <button className="secondary-btn">Create Account</button>
          </Link>
        </div>
      </motion.div>

      {/* RIGHT SIDE ANIMATED CARTOON */}
      <motion.div
        className="home-right"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="phone">
          <div className="screen">
            <div className="message spam">⚠ Spam Message</div>
            <div className="message safe">✔ Safe Message</div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
