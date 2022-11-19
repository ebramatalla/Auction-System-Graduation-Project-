/* cSpell:disable */

export const getWarnUserEmailContent = ({
	username,
	warningMessage,
}: {
	username: string;
	warningMessage: string;
}): string => {
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta http-equiv="x-ua-compatible" content="ie=edge">
			<title>Auction started</title>
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<style type="text/css">
			/**
			 * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
			 */
			@media screen {
				@font-face {
					font-family: 'Source Sans Pro';
					font-style: normal;
					font-weight: 400;
					src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
				}

				@font-face {
					font-family: 'Source Sans Pro';
					font-style: normal;
					font-weight: 700;
					src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
				}
			}

			/**
			 * Avoid browser level font resizing.
			 * 1. Windows Mobile
			 * 2. iOS / OSX
			 */
			body,
			table,
			td,
			a {
				-ms-text-size-adjust: 100%; /* 1 */
				-webkit-text-size-adjust: 100%; /* 2 */
			}

			/**
			 * Remove extra space added to tables and cells in Outlook.
			 */
			table,
			td {
				mso-table-rspace: 0pt;
				mso-table-lspace: 0pt;
			}

			/**
			 * Better fluid images in Internet Explorer.
			 */
			img {
				-ms-interpolation-mode: bicubic;
			}

			/**
			 * Remove blue links for iOS devices.
			 */
			a[x-apple-data-detectors] {
				font-family: inherit !important;
				font-size: inherit !important;
				font-weight: inherit !important;
				line-height: inherit !important;
				color: inherit !important;
				text-decoration: none !important;
			}

			/**
			 * Fix centering issues in Android 4.4.
			 */
			div[style*="margin: 16px 0;"] {
				margin: 0 !important;
			}

			body {
				width: 100% !important;
				height: 100% !important;
				padding: 0 !important;
				margin: 0 !important;
			}

			/**
			 * Collapse table borders to avoid space between cells.
			 */
			table {
				border-collapse: collapse !important;
			}

			a {
				color: #821D30;
				font-weight: bold;
				text-decoration: none
			}

			img {
				height: auto;
				line-height: 100%;
				text-decoration: none;
				border: 0;
				outline: none;
			}
			</style>

		</head>
		<body style="background-color: #e9ecef;">

			<!-- start preheader -->
			<div className="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
				A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
			</div>
			<!-- end preheader -->

			<!-- start body -->
			<table border="0" cellpadding="0" cellspacing="0" width="100%">

				<!-- start logo -->
				<tr>
					<td align="center" bgcolor="#e9ecef">
						<!--[if (gte mso 9)|(IE)]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
						<tr>
						<td align="center" valign="top" width="600">
						<![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
							<tr>
								<td align="center" valign="top" style="padding: 36px 24px;">
									<h1 style="color: #B58B00">Online Auction System</h1>
									<h3 style="color: #B58B00
"><strong>Warning Alert Action 🔔</strong></h3>
									</a>
								</td>
							</tr>
						</table>
						<!--[if (gte mso 9)|(IE)]>
						<![endif]-->
					</td>
				</tr>
				<!-- end logo -->

				<!-- start hero -->
				<tr>
					<td align="center" bgcolor="#e9ecef">
						<!--[if (gte mso 9)|(IE)]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
						<tr>
						<td align="center" valign="top" width="600">
						<![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
							<tr>
								<td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
									<h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color: #B58B00
">Warning Notice </h1>
								</td>
							</tr>
						</table>
						<!--[if (gte mso 9)|(IE)]>
						</td>
						</tr>
						</table>
						<![endif]-->
					</td>
				</tr>
				<!-- end hero -->

				<!-- start copy block -->
				<tr>
					<td align="center" bgcolor="#e9ecef">
						<!--[if (gte mso 9)|(IE)]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
						<tr>
						<td align="center" valign="top" width="600">
						<![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

							<!-- start copy -->
							<tr>
								<td align="left" bgcolor="#ffffff" style="padding: 24px 24px 0 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
								<p style="margin: 0;">Dear ${username}, </p>
								<p style="margin: 0;"> As we have received many complaints on you as well as bad review from bidders, we take these seriously and sent this email to you to inform that your account may be suspended for awhile if you don't return in right track. </p>
                                <p style="margin: 0;">The main reason for this warning is: </p>

								</td>
							</tr>
							<!-- end copy -->

							<!-- start button -->
							<tr>
								<td align="left" bgcolor="#ffffff">
									<table border="0" cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td align="center" bgcolor="#ffffff" >
												<table border="0" cellpadding="0" cellspacing="0">
													<tr>
														<td align="center" bgcolor="#1a82e2" style="border-radius: 6px; background: none;">
															<h3 style=" padding: 15px ; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 15px;background-color: #F6BE00; width: fit-content;">${warningMessage}</h3>
														</td>
													</tr>
													<tr>

														<td><span style="color:black ;font-weight: bold; padding:2px">Note:</span> This is your last waning notice. </td>
													</tr>

												</table>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<!-- end button -->

							<!-- start copy -->
							<tr>
								<td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
									<p style="margin: 0;">Cheers,<br> Online Auction System ❤👌🏻</p>
								</td>
							</tr>
							<!-- end copy -->

						</table>
						<!--[if (gte mso 9)|(IE)]>
						</td>
						</tr>
						</table>
						<![endif]-->
					</td>
				</tr>
				<!-- end copy block -->

				<!-- start footer -->
				<tr>
					<td align="center" bgcolor="#e9ecef" style="padding: 24px;">
						<!--[if (gte mso 9)|(IE)]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
						<tr>
						<td align="center" valign="top" width="600">
						<![endif]-->
						<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

							<!-- start permission -->
							<tr>
								<td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
									<p style="margin: 0;">There will be a warning badge in your dashboard until you contact with support to remove it.
								</td>
							</tr>
							<!-- end permission -->



						</table>
						<!--[if (gte mso 9)|(IE)]>
						</td>
						</tr>
						</table>
						<![endif]-->
					</td>
				</tr>
				<!-- end footer -->

			</table>
			<!-- end body -->

		</body>

			`;
};
