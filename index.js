function highlightHTMLContent(htmlContent, plainText, plainTextPositions) {
    let res = "";
    let i=0,j=0,k=0;
    htmlContent = htmlContent.trim();                   // for removing the extra spaces in front and end of htmlContent
    while (i < htmlContent.length) {
        if(htmlContent[i]==='<') {                // for handling the starting and ending tag in one go
            while(htmlContent[i] != '>') {
                res += htmlContent[i];
                i++;
            }
            res += htmlContent[i];
            i++;
            continue;               // in case of continuous tag such as <br><br> and also in case of last tag </p>
        }
        const ind = plainTextPositions[k]?.start;
        if (j === ind) {                 // when position matched
            const matchEndPosition = plainTextPositions[k].end;
            const word = plainText.substring(ind, matchEndPosition);
            res += `<mark>${word}</mark>`;
            k++;
            i += matchEndPosition-ind;
            j = matchEndPosition;
        } else {
            if(j < plainText.length && plainText[j] != htmlContent[i]) {               // for handling extra spaces in plainText
                j++;
            } else {
                res += htmlContent[i];            // for handling non-highlighed text
                i++;
                j++;
            }
        }
    }
    return res;
}


// made some valid testCases
const testCases = [
    {
        htmlContent: '<p>This is a test.</p>',
        plainText: 'This is a test.',
        plainTextPositions: [{ start: 10, end: 14 }],
        expectedOutput: '<p>This is a <mark>test</mark>.</p>'
    },
    {
        htmlContent: '<p>Test test test.</p>',
        plainText: 'Test test test.',
        plainTextPositions: [{ start: 0, end: 4 }, { start: 5, end: 9 }, { start: 10, end: 14 }],
        expectedOutput: '<p><mark>Test</mark> <mark>test</mark> <mark>test</mark>.</p>'
    },
    {
        htmlContent: '   <p>.<em>.<span>.</span>..</em></p>   ',
        plainText: '. . . ..',
        plainTextPositions: [{start: 0, end: 1}, {start: 2, end: 3},{start:4, end:5},{start:6, end:8}],
        expectedOutput: '<p><mark>.</mark><em><mark>.</mark><span><mark>.</mark></span><mark>..</mark></em></p>'
    },
    {
        htmlContent: '   <p>.<a href="jadnfkjadnfdjf">hi </a>i am <a href="lkadfa>sumit </a>   kumar</p>   ',
        plainText: '.hi i am sumit    kumar',
        plainTextPositions: [{start: 1, end: 3}, {start: 9, end: 14},{start:18, end:23}],
        expectedOutput: '<p>.<a href="jadnfkjadnfdjf"><mark>hi</mark> </a>i am <a href="lkadfa><mark>sumit</mark> </a>   <mark>kumar</mark></p>'
    },
    {
        htmlContent: '<p>Highlight these words.</p>',
        plainText: 'Highlight these words.',
        plainTextPositions: [{ start: 0, end: 9 }, { start: 10, end: 15 }],
        expectedOutput: '<p><mark>Highlight</mark> <mark>these</mark> words.</p>'
    },
    {
        htmlContent: ' <p><span>Hi David<br><br>Headline: Energix Closes $520 Million Financing and Tax Equity Deal to Fund New Solar Projects<br><br>Summary: Two deals with Morgan Stanley Renewables Inc. and Santander CIB will help finance the construction and operation of six utility Equity scale solar…<br><br>Read the full article <a href="https://content.seleritycorp.com/hosted/assets/www/UKMW47_hYz_RGzPSpHm44Hi1L49HdNBhs1OkKKW2OPI">here</a><br><br>-------------------------------------<br><br>You received this because you are subscribed to news related to <a href="https://iris.steeleye.co/market/instruments?search=ES0113900J37">ES0113900J37</a>, and this story was marked as 82% relevant.<br><br>Copyright of PR Newswire. All Rights Reserved. Terms and Conditions | Privacy Policy. To stop PR Newswire emails from getting removed by email filters please add our address (noreply@prnewswire.com) to your email address book. Registered Office: 3 Spring Mews, London SE11 5AN. Tel: +44 (0) 207 8405100. <br><br>To unsubscribe change your email preferences, please click <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley">here</a>.<br><br>-------------------------------------<br><br><img src="https://context.seleritycorp.com/selerity/assets/sc_icons/pressRelease.png" alt="Rick Astley" style="width:100px;height:100px;"></span></p>',
        plainText: 'Hi David Headline: Energix Closes $520 Million Financing and Tax Equity Deal to Fund New Solar Projects Summary: Two deals with Morgan Stanley Renewables Inc. and Santander CIB will help finance the construction and operation of six utility Equity scale solar… Read the full article here ------------------------------------- You received this because you are subscribed to news related to ES0113900J37 , and this story was marked as 82% relevant. Copyright of PR Newswire. All Rights Reserved. Terms and Conditions | Privacy Policy. To stop PR Newswire emails from getting removed by email filters please add our address (noreply@prnewswire.com) to your email address book. Registered Office: 3 Spring Mews, London SE11 5AN. Tel: +44 (0) 207 8405100. To unsubscribe change your email preferences, please click here . -------------------------------------',
        plainTextPositions: [{ start: 241, end: 247, }, { start: 518, end: 525, }],
        expectedOutput: '<p><span>Hi David<br><br>Headline: Energix Closes $520 Million Financing and Tax Equity Deal to Fund New Solar Projects<br><br>Summary: Two deals with Morgan Stanley Renewables Inc. and Santander CIB will help finance the construction and operation of six utility <mark>Equity</mark> scale solar…<br><br>Read the full article <a href="https://content.seleritycorp.com/hosted/assets/www/UKMW47_hYz_RGzPSpHm44Hi1L49HdNBhs1OkKKW2OPI">here</a><br><br>-------------------------------------<br><br>You received this because you are subscribed to news related to <a href="https://iris.steeleye.co/market/instruments?search=ES0113900J37">ES0113900J37</a>, and this story was marked as 82% relevant.<br><br>Copyright of PR Newswire. All Rights Reserved. Terms and Conditions | <mark>Privacy</mark> Policy. To stop PR Newswire emails from getting removed by email filters please add our address (noreply@prnewswire.com) to your email address book. Registered Office: 3 Spring Mews, London SE11 5AN. Tel: +44 (0) 207 8405100. <br><br>To unsubscribe change your email preferences, please click <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley">here</a>.<br><br>-------------------------------------<br><br><img src="https://context.seleritycorp.com/selerity/assets/sc_icons/pressRelease.png" alt="Rick Astley" style="width:100px;height:100px;"></span></p>',
    },
];

// made function to iterate over testcases
function testHighlightHTMLContent() {
    for (const testCase of testCases) {
        const actualOutput = highlightHTMLContent(
            testCase.htmlContent,
            testCase.plainText,
            testCase.plainTextPositions
        );
        if (actualOutput === testCase.expectedOutput) {
            console.log('Test Passed:');
            console.log('Expected output: ',testCase.expectedOutput);
            console.log('Actual Output: ', actualOutput);
        } else {
            console.log('Test Failed:');
            console.log('Expected output: ',testCase.expectedOutput);
            console.log('Actual Output: ', actualOutput);
        }
    }
}

testHighlightHTMLContent();
