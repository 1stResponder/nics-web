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
define(["iweb/CoreModule", './UserController'], function(Core) {
    Ext.define('modules.user.UserView', {

        extend: 'Ext.Window',

        controller: 'usermodulecontroller',

        referenceHolder: true,

        requires: [ 'Ext.Panel', 'Ext.Button', 'Ext.form.field.TextArea',
            'Ext.form.Label', 'Ext.Container', 'Ext.tree.Panel'],

        initComponent: function(){
            this.callParent();
            var label =  Ext.create('Ext.form.Label',{
                id:'user-label',
                html: 'Enter a message to user'
            });

            this.userInput = Ext.create('Ext.form.field.TextArea',
                {
                    id: 'userInputTextarea',
                    name: 'userInput',
                    stripCharsRe: /[^a-zA-Z0-9,_\-\.\s]/,
                    maxLength: 500,
                    enforceMaxLength: true
                }
            );

            var panel = Ext.create("Ext.Panel", {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                autoHeight: true,
                autoWidth: true,
                header: false,
                items: [
                    label,
                    this.userInput
                ]
            });

            this.add(panel);
        },

        getUserMessage: function(){
            return this.userInput.getValue();
        },

        resetUserMessage: function()
        {
            this.userInput.setValue('');
        },

        config: {
            title: 'User Alert',
            closable: true,
            width: 350,
            autoHeight: true,
            minButtonWidth: 0,
            closeAction: 'hide',
            buttons: [
                {
                    text: 'OK',
                    listeners: {
                        click: 'publishUser'
                    },
                    scale: 'medium'
                }
            ],
            buttonAlign: 'center'
        }
    });
});


