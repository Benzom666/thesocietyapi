/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const async = require('async');
const bcrypt = require('bcrypt');
const randomNumber = require('random-number');
const mongoose = require('mongoose');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Requests = require('../../models/requests');
const helper = require('../../helpers/helper');
const mails = require('../../helpers/mails');

exports.getAllRequests = async(req, res) => {
    const { gender, email } = req.datajwt.userdata;
    const { status = 0 } = req.query;


    const requests = await Requests.find({ receiver_id: email, status: status },{_id: 0, __v: 0});

    if(!requests.length) {
        return res.status(200).json(helper.successResponse([], 200, 'No requests received.'));
    }

    return res.status(200).json(helper.successResponse(requests, 201, 'Requests received.'));
}
exports.getSentRequests = async (req, res) => {
    try {
        const { email } = req.datajwt.userdata;
        const { status } = req.query; // optional filter

        const filter = { requester_id: email };
        if (typeof status !== 'undefined') {
            filter.status = Number(status);
        }
        const requests = await Requests.find(filter, { __v: 0 });
        return res.status(200).json(helper.successResponse(requests, 200, 'Sent requests fetched.'));
    } catch (err) {
        console.error('getSentRequests error', err);
        return res.status(500).json(helper.errorResponse({}, 500, 'Failed to fetch sent requests.'));
    }
}

exports.getSentRequests = async(req, res) => {
    const { email } = req.datajwt.userdata;
    const { status } = req.query;
    const filter = { requester_id: email };
    if (typeof status !== 'undefined') {
        const st = parseInt(status, 10);
        if (!Number.isNaN(st)) filter.status = st;
    }

    const requests = await Requests.find(filter, { _id: 0, __v: 0 });
    if(!requests.length) {
        return res.status(200).json(helper.successResponse([], 200, 'No sent requests.'));
    }
    return res.status(200).json(helper.successResponse(requests, 201, 'Sent requests.'));
}

exports.sendRequest = async(req, res) => {
    const { message, receiver_id } = req.body;
    const { gender, email } = req.datajwt.userdata;

    if(gender.toLowerCase() == 'f' || gender.toLowerCase() == 'female') {
      return res.status(400).json(helper.errorResponse([], 400, 'You are not allowed to send request!'));
    }

    const requests = await Requests.find({ requester_id: email, receiver_id: receiver_id  }, { _id: 0, __v: 0});

    if(requests.length) {

        requests.map((request) => {
            if(request.status == 0) {
                return res.status(200).json(helper.successResponse(request, 201, 'Please wait for request approval.'));
            }

            if(request.status == 1) {
               return  res.status(200).json(helper.successResponse(request, 201, 'Request already accepted. You can send message now.'));
            }

            if(request.status == 2) {
                return res.status(200).json(helper.successResponse(request, 201, 'Request is rejected.'));
            }
        })
    } else {
        const request = new Requests({
            ...req.body,
            requester_id: email
            //    status: 0
        });

        let requestResponse = await request.save()
        if(requestResponse) {
            return res.status(200).json(helper.successResponse(request, 201, 'Request sent.Please wait for the approval.'));
        }
    }



    // console.log(message)
}