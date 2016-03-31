/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(['ext', "iweb/CoreModule", 'nics/modules/UserProfileModule'],
    function(Ext, Core, UserProfile){
        Ext.define('modules.feedback.FeedbackReportController', {
            extend : 'Ext.app.ViewController',

            alias: 'controller.feedbackcontroller',

            TOPIC_KEY: "feedback.topic",
            TO_KEY: "feedback.email.to",
            SUBJECT_KEY: "feedback.email.subject",


            init: function(){
                this.mediator = Core.Mediator.getInstance();
            },

            publishFeedbackReport: function()
            {
                var content = this.getView().getFeedbackMessage();
                // validate feedback message
                if (Core.Util.isValidInput(content))
                {
                    console.log('Content validated');
                    var topic = Core.Config.getProperty(this.TOPIC_KEY);
                    console.log("Retrieved Feedback property value: " + topic);
                    if (topic)
                    {
                        var subject = Core.Config.getProperty(this.SUBJECT_KEY) + ' ' + location.hostname;
                        var msgBody = 'Feedback Report from: ' + UserProfile.getUsername() + '\n' +
                            'Browser: ' + Core.Util.getBrowserVersion() + '\n\n' +
                            Core.Util.getValidInput(content);
                        var message = {
                            to: Core.Config.getProperty(this.TO_KEY),
                            from: UserProfile.getUsername(),
                            subject: subject,
                            body: msgBody
                        };
                        if (this.mediator && this.mediator.publishMessage)
                        {
                            console.log(JSON.stringify(message));

                            this.mediator.publishMessage(topic, message);

                            // reset feedback message
                            this.getView().resetFeedbackMessage();
                            // hide window
                            this.getView().hide();
                        } else
                        {
                            console.error("publishMessage function not defined!");
                        }

                    } else{
                        // TODO log error or alert user to notify system administrators topic property not set
                        console.error("Couldn't retrieve topic from properties");
                    }
                } else
                {
                    console.log('Content not valid');
                    alert('Feedback message content not valid');
                }
            },

            publishReport: function(to, subject, body)
            {
                var topic = Core.Config.getProperty(this.TOPIC_KEY);
                if (topic)
                {
                    var message = {
                        to: to,
                        from: UserProfile.getUsername(),
                        subject: subject,
                        body: body
                    };
                    this.mediator.publishMessage(topic, message);
                }
            }
        });
    });


