

export const richMailTemplate = async ({ mail_html }: { mail_html: string }): Promise<string> => {
  const year = new Date().getFullYear();

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta
                name="x-apple-disable-message-reformatting"
            />
            <title>Mkrod Sullivan</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            width:100%;
            background-color:#f5f6f2;
            font-family:Arial, Helvetica, sans-serif;
            -webkit-font-smoothing:antialiased;
        ">

            <!-- EMAIL WRAPPER -->
            <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    width:100%;
                    background-color:#f5f6f2;
                    padding:40px 16px;
                "
            >
                <tr>
                    <td align="center">

                        <!-- EMAIL CONTAINER -->
                        <table
                            role="presentation"
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                width:100%;
                                max-width:640px;
                                background-color:#ffffff;
                            "
                        >

                            <!-- HEADER -->
                            <tr>
                                <td style="
                                    padding:28px 32px;
                                    background-color:#171914;
                                    border-bottom:3px solid #8da900;
                                ">
                                    <table
                                        role="presentation"
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                    >
                                        <tr>
                                            <td>
                                                <div style="
                                                    color:#ffffff;
                                                    font-size:18px;
                                                    line-height:24px;
                                                    font-weight:800;
                                                    letter-spacing:-0.4px;
                                                ">
                                                    Mkrod Sullivan
                                                </div>

                                                <div style="
                                                    margin-top:4px;
                                                    color:#aeb1a7;
                                                    font-size:11px;
                                                    line-height:17px;
                                                    font-weight:600;
                                                    letter-spacing:1.2px;
                                                    text-transform:uppercase;
                                                ">
                                                    Full Stack Developer
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- CONTENT -->
                            <tr>
                                <td style="
                                    padding:40px 36px;
                                    color:#171914;
                                    font-size:15px;
                                    line-height:25px;
                                ">
                                    ${mail_html}
                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td style="
                                    padding:24px 32px;
                                    background-color:#f5f6f2;
                                    border-top:1px solid #d9dcd2;
                                ">
                                    <table
                                        role="presentation"
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                    >
                                        <tr>
                                            <td>
                                                <div style="
                                                    color:#171914;
                                                    font-size:12px;
                                                    line-height:18px;
                                                    font-weight:700;
                                                ">
                                                    Mkrod Sullivan
                                                </div>

                                                <div style="
                                                    margin-top:3px;
                                                    color:#65685f;
                                                    font-size:11px;
                                                    line-height:18px;
                                                ">
                                                    Javascript / Typescript Developer
                                                </div>
                                            </td>

                                            <td align="right">
                                                <div style="
                                                    color:#8da900;
                                                    font-size:11px;
                                                    line-height:18px;
                                                    font-weight:700;
                                                ">
                                                    mkrodsullivan.com
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td
                                                colspan="2"
                                                style="
                                                    padding-top:18px;
                                                    color:#8b8e85;
                                                    font-size:10px;
                                                    line-height:17px;
                                                "
                                            >
                                                © ${year} Mkrod Sullivan. All rights reserved.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
    `;
};