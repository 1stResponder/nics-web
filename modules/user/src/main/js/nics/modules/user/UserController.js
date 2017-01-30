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
        Ext.define('modules.user.UserController', {
            extend : 'Ext.app.ViewController',

            alias: 'controller.usermodulecontroller',

            TOPIC_KEY: "user.topic",
            TO_KEY: "user.email.to",
            SUBJECT_KEY: "user.email.subject",

            init: function(){
                this.mediator = Core.Mediator.getInstance();
            },

            publishUser: function()
            {
                var content = this.getView().getUserMessage();
                // validate user message
                if (Core.Util.isValidInput(content))
                {
                    
                    var topic = Core.Config.getProperty(this.TOPIC_KEY);
                    
                    if (topic)
                    {
                        var subject = Core.Config.getProperty(this.SUBJECT_KEY) + ' ' + location.hostname;
                        var msgBody = 'User Report from: ' + UserProfile.getUsername() + '\n' +
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

                            this.mediator.publishMessage(topic, message);

                            // reset user message
                            this.getView().resetUserMessage();
                            // hide window
                            this.getView().hide();
                        } else
                        {
                        	Ext.MessageBox.alert("NICS", "Unable to send user report");
                        }

                    } else{
                        // TODO log error or alert user to notify system administrators topic property not set
                        Ext.MessageBox.alert("NICS", "Unable to send user report");
                    }
                } else
                {
                    Ext.MessageBox.alert("NICS", "Unable to send user report: User message content not valid");
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


