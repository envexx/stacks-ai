# 🎬 StacksAI Demo Video Script (5 Minutes)

## 📋 Pre-Recording Checklist
- [ ] Hiro Wallet installed and funded with testnet STX
- [ ] Demo environment ready (localhost or live deployment)
- [ ] Screen recording software ready (Loom/OBS)
- [ ] Microphone tested
- [ ] Browser tabs prepared
- [ ] Notes visible (optional)

---

## 🎯 Video Structure

**Total Duration**: 5 minutes
- Introduction: 30 seconds
- Live Demo: 2-3 minutes
- Technical Deep Dive: 1-2 minutes
- Conclusion: 30 seconds

---

## 🎬 SCENE 1: Introduction (30 seconds)

### Visual
- Show StacksAI landing page
- Highlight logo and tagline

### Script
```
Hi! I'm [Your Name], and I'm excited to show you StacksAI - a decentralized 
AI access platform built on the Stacks blockchain.

Traditional AI services lock you into expensive monthly subscriptions, even 
if you only use them occasionally. StacksAI solves this with blockchain-verified 
micro-payments - you pay only for what you use, as low as 4 cents per prompt.

But here's what makes it special: we use the x402-stacks protocol, which 
implements HTTP 402 "Payment Required" on the Stacks blockchain. Let me show 
you how it works.
```

### Key Points
- ✅ Introduce yourself
- ✅ State the problem (subscription lock-in)
- ✅ Present the solution (pay-per-use)
- ✅ Mention x402-stacks integration

---

## 🎬 SCENE 2: Live Demo (2-3 minutes)

### Part A: Landing Page Tour (20 seconds)

#### Visual
- Scroll through landing page
- Highlight key features
- Show pricing cards

#### Script
```
Here's our landing page. You can see we support three AI models:
- GPT-3.5 Turbo at 0.02 STX per prompt
- GPT-4 Turbo at 0.1 STX
- And Claude 3 Opus at 0.12 STX

Each payment is verified on the Stacks blockchain, giving you transparency 
and security that traditional payment systems can't match.
```

### Part B: Wallet Connection (30 seconds)

#### Visual
- Click "Chat" button
- Show Hiro Wallet popup
- Connect wallet
- Show connected address

#### Script
```
Let's try it out. I'll click "Chat" to access the AI playground.

First, I need to connect my Hiro Wallet - this is a Stacks wallet that lets 
me hold and transfer STX tokens. 

[Click connect]

Great! My wallet is now connected. You can see my Stacks address here at 
the top. I'm on the testnet, so these are test tokens.
```

### Part C: The 402 Payment Flow (90 seconds)

#### Visual
- Select GPT-4 model
- Type a prompt: "Explain how blockchain can revolutionize AI access"
- Click Send
- Show 402 Payment Required response
- Highlight payment details
- Approve STX transfer in Hiro Wallet
- Show transaction pending
- Show AI response received

#### Script
```
Now, let me select GPT-4 Turbo and ask it a question about blockchain and AI.

[Type and send prompt]

Watch what happens - instead of immediately processing my request, the API 
returns an HTTP 402 "Payment Required" response. This is the x402 protocol 
in action!

The response includes:
- The exact STX amount needed: 0.1 STX
- The recipient address
- A unique nonce to prevent replay attacks
- And payment instructions

Now, my frontend automatically initiates a Stacks transaction. Let me approve 
it in my Hiro Wallet.

[Approve transaction]

The transaction is now being broadcast to the Stacks blockchain. This typically 
takes 10-30 seconds to confirm.

[Wait for confirmation - can speed up in editing]

Perfect! The payment is confirmed. Now my app automatically retries the API 
request, this time including the transaction ID as proof of payment.

And there's my AI response! The entire flow - from prompt to payment to 
response - is transparent and verifiable on the blockchain.
```

### Key Points
- ✅ Show 402 response clearly
- ✅ Explain payment details
- ✅ Show wallet approval
- ✅ Highlight blockchain verification
- ✅ Show successful AI response

---

## 🎬 SCENE 3: Technical Deep Dive (1-2 minutes)

### Part A: Architecture Overview (30 seconds)

#### Visual
- Show architecture diagram (from FLOW_DIAGRAMS.md)
- Or show code in IDE

#### Script
```
Let me show you how this works under the hood.

Our architecture has three main components:

1. The Next.js frontend that users interact with
2. An Express.js API gateway that implements the x402 protocol
3. And the Stacks blockchain for payment verification

When you send a prompt without payment, the API returns 402 with payment 
instructions. The frontend then uses the Stacks.js SDK to create a token 
transfer transaction. Once confirmed on-chain, we verify the payment and 
process the AI request.
```

### Part B: x402-Stacks Integration (45 seconds)

#### Visual
- Show x402.middleware.ts code
- Highlight key functions
- Show payment verification logic

#### Script
```
The magic happens in our X402 Middleware. Here's the flow:

First, we check if the request includes a payment proof header. If not, we 
return 402 with payment details including a unique nonce.

When payment is submitted, we:
1. Verify the nonce hasn't been used before - this prevents replay attacks
2. Query the Stacks blockchain API to confirm the transaction
3. Verify the amount matches what we requested
4. Check the recipient address is correct
5. And finally, mark the nonce as used

Only after all these checks pass do we allow the AI request to proceed.

This gives us the security of blockchain verification with the simplicity 
of HTTP APIs.
```

### Part C: Stacks Benefits (30 seconds)

#### Visual
- Show Stacks.co website or logo
- Show Bitcoin logo
- Show security/speed comparison

#### Script
```
Why Stacks? Three key reasons:

First, Stacks is secured by Bitcoin through its unique Proof of Transfer 
mechanism. Every Stacks block is anchored to Bitcoin, giving us Bitcoin-level 
security for our smart contracts.

Second, Stacks enables smart contracts and token transfers that Bitcoin alone 
can't do - perfect for our pay-per-use model.

And third, the Stacks ecosystem is growing rapidly, with excellent developer 
tools like the Hiro Wallet and Stacks.js SDK that made this integration 
straightforward.
```

### Key Points
- ✅ Explain architecture clearly
- ✅ Show x402 implementation
- ✅ Highlight security features
- ✅ Explain Stacks benefits

---

## 🎬 SCENE 4: Conclusion (30 seconds)

### Visual
- Return to landing page
- Show GitHub repository
- Show documentation

#### Script
```
So that's StacksAI - bringing together AI, blockchain, and the x402 protocol 
to create a fairer, more accessible way to use premium AI models.

This project demonstrates real-world utility for the Stacks ecosystem beyond 
DeFi. It shows how blockchain can solve actual problems in the AI space - 
micropayments, transparency, and global accessibility.

All the code is open source on GitHub, with comprehensive documentation 
including our x402 integration guide and deployment instructions.

The future of AI access is decentralized, and it's built on Stacks.

Thank you for watching!
```

### Key Points
- ✅ Summarize value proposition
- ✅ Highlight Stacks ecosystem benefits
- ✅ Mention open source
- ✅ Strong closing statement

---

## 📝 Recording Tips

### Before Recording
1. **Practice the script** 2-3 times
2. **Test the demo flow** to ensure no errors
3. **Prepare fallbacks** if wallet/network is slow
4. **Clear browser history** for clean demo
5. **Close unnecessary tabs/apps**

### During Recording
1. **Speak clearly and enthusiastically**
2. **Pause between sections** (easier to edit)
3. **Show, don't just tell** - let visuals speak
4. **If you make a mistake**, pause and restart that section
5. **Keep energy high** throughout

### After Recording
1. **Review the footage**
2. **Cut out long pauses** (wallet confirmations)
3. **Add text overlays** for key points
4. **Add background music** (optional, keep it subtle)
5. **Export in 1080p** minimum

---

## 🎨 Visual Enhancements (Optional)

### Text Overlays
- "HTTP 402 Payment Required" when showing 402 response
- "0.1 STX = ~$0.08" for pricing context
- "Verified on Stacks Blockchain ✓" after confirmation
- "Bitcoin-Secured Smart Contracts" when discussing Stacks

### Arrows/Highlights
- Circle the 402 status code
- Highlight payment amount
- Point to transaction ID
- Underline key code sections

### B-Roll Suggestions
- Stacks blockchain explorer showing transaction
- GitHub repository stars/activity
- Documentation pages
- Architecture diagrams

---

## 📊 Key Metrics to Mention

- **Payment Speed**: 10-30 seconds for confirmation
- **Cost**: As low as $0.04 per prompt
- **Security**: Bitcoin-anchored via Proof of Transfer
- **Transparency**: All payments verifiable on-chain
- **Accessibility**: No credit card required

---

## 🚀 Call to Action

End with:
```
Check out the GitHub repository at github.com/envexx/stacks-ai
Try the live demo at [your-deployment-url]
Read the full documentation and integration guide
And join us in building the future of decentralized AI!
```

---

## 📱 Platform-Specific Notes

### YouTube
- Title: "StacksAI: Pay-per-Prompt AI on Bitcoin with x402-Stacks Protocol"
- Description: Include links to repo, demo, Stacks.co
- Tags: stacks, bitcoin, blockchain, AI, GPT-4, web3, x402
- Thumbnail: StacksAI logo + "Decentralized AI Access"

### Vimeo
- Similar title and description
- Enable download for judges

### Loom
- Add chapters for easy navigation
- Share link in README.md

---

## ✅ Final Checklist

Before uploading:
- [ ] Video is under 5 minutes
- [ ] Audio is clear
- [ ] Demo works smoothly
- [ ] All key points covered
- [ ] x402 integration explained
- [ ] Stacks benefits highlighted
- [ ] GitHub link mentioned
- [ ] Professional quality
- [ ] Exported in HD (1080p)
- [ ] Uploaded to platform
- [ ] Link added to README.md

---

## 🎯 Success Criteria

Your video should:
1. ✅ Clearly explain the problem and solution
2. ✅ Demonstrate working x402 payment flow
3. ✅ Show actual blockchain transaction
4. ✅ Explain technical implementation
5. ✅ Highlight Stacks ecosystem benefits
6. ✅ Be engaging and professional
7. ✅ Stay within 5-minute limit

Good luck with your recording! 🎬🚀
